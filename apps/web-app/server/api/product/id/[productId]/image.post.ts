import type { MediaItemDraft } from '@roll-stack/database'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@roll-stack/database'
import sharp from 'sharp'

const PRODUCTS_DIRECTORY = 'products'

const IMAGE_SIZES = [120, 300, 600, 840, 1200]
const IMAGE_FORMATS = ['jpg', 'webp'] as const
const ACCEPTED_IMAGE_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'heif']

export default defineEventHandler(async (event) => {
  let sharpStream

  try {
    hasPermission(event.context.user, 'product:image:edit')

    const { public: { mediaUrl } } = useRuntimeConfig()
    const storage = useStorage('s3')

    const productId = getRouterParam(event, 'productId')
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Missing product id',
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

    if (metadata.width < 120 || metadata.height < 120) {
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
          .resize({ width: size, height: size / 1.5 })
          .toFormat(format, { quality: 90 })
          .toBuffer()

        const id = createId()

        await storage.setItemRaw(`/${PRODUCTS_DIRECTORY}/${mediaId}/${id}.${format}`, buffer)

        items.push({
          id,
          mediaId,
          size,
          format,
          url: `${mediaUrl}/${PRODUCTS_DIRECTORY}/${mediaId}/${id}.${format}`,
        })

        // Clear
        buffer = null
      }
    }

    await db.media.create({
      id: mediaId,
    })

    for (const item of items) {
      await db.media.createItem(item)
    }

    const product = await db.product.find(productId)
    if (product?.id && product?.mediaId) {
      const media = await db.media.find(product.mediaId)
      if (media) {
        // Remove old images
        for (const item of media.items) {
          await storage.removeItem(`/${PRODUCTS_DIRECTORY}/${item.mediaId}/${item.id}.${item.format}`)
        }

        await db.product.update(product.id, { mediaId: null })
        await db.media.delete(media.id)
      }
    }

    await db.product.update(productId, { mediaId })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  } finally {
    sharpStream?.destroy()
  }
})
