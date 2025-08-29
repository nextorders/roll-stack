import { updateProductSchema } from '#shared/services/product'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    await hasPermission(event, 'product:edit')

    const productId = getRouterParam(event, 'productId')
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updateProductSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const product = await repository.product.update(productId, data)

    // Update all product tags
    if (data.tagsId) {
      await repository.product.updateTags(productId, data.tagsId)
    }

    return {
      ok: true,
      result: product,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
