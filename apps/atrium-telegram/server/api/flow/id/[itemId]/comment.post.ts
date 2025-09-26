import { createFlowItemCommentSchema } from '#shared/services/flow'
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

    const body = await readBody(event)
    const data = createFlowItemCommentSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    // Guards:
    // If not exist
    const item = await repository.flow.findItem(itemId)
    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      })
    }

    await repository.flow.createItemComment({
      text: data.text,
      itemId,
      userId: event.context.user.id,
    })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
