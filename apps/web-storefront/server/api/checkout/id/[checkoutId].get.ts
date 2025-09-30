import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const checkoutId = getRouterParam(event, 'checkoutId')
    if (!checkoutId) {
      throw createError({
        statusCode: 400,
        message: 'Missing data',
      })
    }

    return db.checkout.find(checkoutId)
  } catch (error) {
    throw errorResolver(error)
  }
})
