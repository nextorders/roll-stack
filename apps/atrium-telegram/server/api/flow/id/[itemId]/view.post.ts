import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const itemId = getRouterParam(event, 'itemId')
    if (!itemId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guards:
    // If not exist
    // If already viewed
    const item = await repository.flow.findItem(itemId)
    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      })
    }
    if (item.views.some((view) => view.userId === event.context.user.id)) {
      throw createError({
        statusCode: 400,
        message: 'Already viewed',
      })
    }

    await repository.flow.createItemView({
      itemId,
      userId: event.context.user.id,
    })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
