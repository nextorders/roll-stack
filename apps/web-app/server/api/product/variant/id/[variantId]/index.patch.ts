import { updateProductVariantSchema } from '#shared/services/product'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'product:edit')

    const variantId = getRouterParam(event, 'variantId')
    if (!variantId) {
      throw createError({
        statusCode: 400,
        message: 'Missing id',
      })
    }

    const body = await readBody(event)
    const data = updateProductVariantSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const variant = await db.product.findVariant(variantId)
    if (!variant) {
      throw createError({
        statusCode: 404,
        message: 'Variant not found',
      })
    }

    const updatedVariant = await db.product.updateVariant(variantId, data)

    // Update all tags
    if (data.tagsId) {
      await db.product.updateTagsOnVariant(variantId, data.tagsId)
    }

    return {
      ok: true,
      result: updatedVariant,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
