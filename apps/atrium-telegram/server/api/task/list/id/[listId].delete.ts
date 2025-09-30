import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const listId = getRouterParam(event, 'listId')
    if (!listId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const list = await db.task.findList(listId)
    if (!list) {
      throw createError({
        statusCode: 404,
        message: 'Task list not found',
      })
    }

    // Guard: if don't have access
    const canEdit = list.chat?.members.some((member) => member.userId === event.context.user.id)
    if (!canEdit) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      })
    }

    // Archive, not delete
    await db.task.updateList(listId, {
      isArchived: true,
    })

    // Archive chat
    if (list.chatId) {
      await db.chat.update(list.chatId, {
        isArchived: true,
      })
    }

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
