import { updateProductSchema } from '#shared/services/product'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'product:edit')

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

    const product = await db.product.update(productId, data)

    // Update all product tags
    if (data.tagsId) {
      await db.product.updateTags(productId, data.tagsId)
    }

    return {
      ok: true,
      result: product,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
