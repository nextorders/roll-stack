import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  const kitchenId = getRouterParam(event, 'kitchenId')
  if (!kitchenId) {
    throw createError({
      statusCode: 400,
      message: 'Id is required',
    })
  }

  const query = getQuery(event)
  const start = query.start ? new Date(query.start.toString()) : null
  const end = query.end ? new Date(query.end.toString()) : null
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw createError({
      statusCode: 400,
      message: 'Valid start and end dates are required',
    })
  }

  return db.kitchen.listRevenuesByKitchenForPeriod(kitchenId, start, end)
})
