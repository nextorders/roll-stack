import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  const kitchenId = getRouterParam(event, 'kitchenId')
  if (!kitchenId) {
    throw createError({
      statusCode: 400,
      message: 'Id is required',
    })
  }

  return db.kitchen.listRevenuesByKitchen(kitchenId)
})
