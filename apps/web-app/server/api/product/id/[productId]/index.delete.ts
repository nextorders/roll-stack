import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'product:delete')

    const productId = getRouterParam(event, 'productId')
    if (!productId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    await db.product.delete(productId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
