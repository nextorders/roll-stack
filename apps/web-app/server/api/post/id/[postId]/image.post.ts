import type { MediaItemDraft } from '@roll-stack/database'
import { createId } from '@paralleldrive/cuid2'
import { repository } from '@roll-stack/database'
import sharp from 'sharp'

const POSTS_DIRECTORY = 'posts'
const IMAGE_SIZES = [600, 1200]
const IMAGE_FORMATS = ['jpg', 'webp'] as const
const ACCEPTED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'heif', 'avif']

export default defineEventHandler(async (event) => {
  let sharpStream

  try {
    hasPermission(event.context.user, 'post:image:edit')

    const { public: { mediaUrl } } = useRuntimeConfig()
    const storage = useStorage('s3')

    const postId = getRouterParam(event, 'postId')
    if (!postId) {
      throw createError({
        statusCode: 400,
        message: 'Missing id',
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
    validateMetadata(metadata, 8000, 600)

    const mediaId = createId()
    const items: MediaItemDraft[] = []

    // Every size
    for (const size of IMAGE_SIZES) {
      // Every format
      for (const format of IMAGE_FORMATS) {
        let buffer: unknown = await sharpStream
          .resize({ width: size })
          .toFormat(format, { quality: 90 })
          .toBuffer()

        const id = createId()

        await storage.setItemRaw(`/${POSTS_DIRECTORY}/${mediaId}/${id}.${format}`, buffer)

        items.push({
          id,
          mediaId,
          size,
          format,
          url: `${mediaUrl}/${POSTS_DIRECTORY}/${mediaId}/${id}.${format}`,
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

    const post = await repository.post.find(postId)
    if (post?.id && post?.mediaId) {
      const media = await repository.media.find(post.mediaId)
      if (media) {
        // Remove old images
        for (const item of media.items) {
          await storage.removeItem(`/${POSTS_DIRECTORY}/${item.mediaId}/${item.id}.${item.format}`)
        }

        await repository.post.update(post.id, { mediaId: null })
        await repository.media.delete(media.id)
      }
    }

    await repository.post.update(postId, { mediaId })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  } finally {
    sharpStream?.destroy()
  }
})

function validateMetadata(metadata: sharp.Metadata, maxSize: number, minSize: number) {
  if (!metadata?.format || !ACCEPTED_IMAGE_FORMATS.includes(metadata.format) || !metadata.width || !metadata.height) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type',
    })
  }

  if (metadata.width > maxSize || metadata.height > maxSize) {
    throw createError({
      statusCode: 400,
      message: 'Image has too big dimensions',
    })
  }

  if (metadata.width < minSize || metadata.height < minSize) {
    throw createError({
      statusCode: 400,
      message: 'Image has too small dimensions',
    })
  }
}
