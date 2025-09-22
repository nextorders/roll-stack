import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'product:delete')

    const variantId = getRouterParam(event, 'variantId')
    if (!variantId) {
      throw createError({
        statusCode: 400,
        message: 'Missing id',
      })
    }

    await repository.product.deleteVariant(variantId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
