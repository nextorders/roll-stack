import type { MediaItemDraft } from '@roll-stack/database'
import { createId } from '@paralleldrive/cuid2'
import { repository } from '@roll-stack/database'
import sharp from 'sharp'

const USER_AVATARS_DIRECTORY = 'users'

const IMAGE_SIZES = [256, 512]
const IMAGE_FORMATS = ['jpg', 'webp'] as const
const ACCEPTED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'heif', 'avif']

export default defineEventHandler(async (event) => {
  let sharpStream

  try {
    // await hasPermission(event, 'product:image:edit')

    const { public: { mediaUrl } } = useRuntimeConfig()
    const storage = useStorage('s3')

    const userId = getRouterParam(event, 'userId')
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'Missing id',
      })
    }

    // Guard: if not this user
    if (event.context.user.id !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      })
    }

    const files = await readMultipartFormData(event)
    const file = files?.[0]
    if (!files?.length || !file) {
      throw createError({
        statusCode: 400,
        message: 'Missing file',
      })
    }

    sharp.cache(false)
    sharp.concurrency(1)

    sharpStream = sharp(file.data.buffer as ArrayBuffer)

    const metadata = await sharpStream.clone().metadata()

    if (!metadata?.format || !ACCEPTED_IMAGE_FORMATS.includes(metadata?.format) || !metadata?.width || !metadata?.height) {
      throw createError({
        statusCode: 400,
        message: 'Invalid file type',
      })
    }

    if (metadata.width > 8000 || metadata.height > 8000) {
      throw createError({
        statusCode: 400,
        message: 'Image has too big dimensions',
      })
    }

    if (metadata.width < 256 || metadata.height < 256) {
      throw createError({
        statusCode: 400,
        message: 'Image has too small dimensions',
      })
    }

    const mediaId = createId()
    const items: MediaItemDraft[] = []

    // Every size
    for (const size of IMAGE_SIZES) {
      // Every format
      for (const format of IMAGE_FORMATS) {
        let buffer: unknown = await sharpStream
          .resize({ width: size, height: size })
          .toFormat(format, { quality: 90 })
          .toBuffer()

        const id = createId()

        await storage.setItemRaw(`/${USER_AVATARS_DIRECTORY}/${mediaId}/${id}.${format}`, buffer)

        items.push({
          id,
          mediaId,
          size,
          format,
          url: `${mediaUrl}/${USER_AVATARS_DIRECTORY}/${mediaId}/${id}.${format}`,
        })

        // Clear
        buffer = null
      }
    }

    await repository.media.create({
      id: mediaId,
    })

    for (const item of items) {
      await repository.media.createItem(item)
    }

    const mainImage = items.find((i) => i.size === 512 && i.format === 'jpg')

    await repository.user.update(userId, { avatarUrl: mainImage?.url })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  } finally {
    sharpStream?.destroy()
  }
})
