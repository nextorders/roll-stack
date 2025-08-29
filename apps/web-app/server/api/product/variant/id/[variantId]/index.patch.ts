import { updateProductVariantSchema } from '#shared/services/product'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'product:edit')

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

    const variant = await repository.product.findVariant(variantId)
    if (!variant) {
      throw createError({
        statusCode: 404,
        message: 'Variant not found',
      })
    }

    const updatedVariant = await repository.product.updateVariant(variantId, data)

    // Update all tags
    if (data.tagsId) {
      await repository.product.updateTagsOnVariant(variantId, data.tagsId)
    }

    return {
      ok: true,
      result: updatedVariant,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
