import { updateActivityScheduleItemSchema } from '#shared/services/activity'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const itemId = getRouterParam(event, 'itemId')
    if (!itemId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: if no item
    const item = await repository.activity.findScheduleItem(itemId)
    if (!item?.id) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      })
    }

    const body = await readBody(event)
    const data = updateActivityScheduleItemSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const updatedItem = await repository.activity.updateScheduleItem(itemId, data)

    return {
      ok: true,
      result: updatedItem,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
