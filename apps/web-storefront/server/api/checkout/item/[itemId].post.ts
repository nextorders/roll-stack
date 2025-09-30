import { db } from '@roll-stack/database'

const MAX_QUANTITY_PER_LINE = 99

export default defineEventHandler(async (event) => {
  try {
    const itemId = getRouterParam(event, 'itemId')
    const body = await readBody(event)

    if (!itemId || !body.method) {
      throw createError({
        statusCode: 400,
        message: 'Missing data',
      })
    }

    const method = body.method === 'increment' ? 'increment' : 'decrement'

    const { secure } = await getUserSession(event)
    if (!secure?.checkoutId) {
      throw createError({
        statusCode: 404,
        message: 'No checkout',
      })
    }

    const checkoutInDB = await db.checkout.find(secure.checkoutId)
    if (!checkoutInDB?.id) {
      throw createError({
        statusCode: 404,
        message: 'No checkout',
      })
    }

    const item = checkoutInDB.items.find((i) => i.id === itemId)
    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'No item',
      })
    }

    if (method === 'increment') {
    // Check limit
      if (item.quantity >= MAX_QUANTITY_PER_LINE) {
        throw createError({
          statusCode: 400,
          message: 'Limit reached',
        })
      }

      await db.checkout.updateItem(item.id, { quantity: item.quantity + 1 })
    } else if (method === 'decrement') {
      await db.checkout.updateItem(item.id, { quantity: item.quantity - 1 })
    }

    await db.checkout.recalculate(checkoutInDB.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
