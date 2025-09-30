import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const taskId = getRouterParam(event, 'taskId')
    if (!taskId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guards:
    // If task not exist
    // If performer is not user
    const task = await db.task.find(taskId)
    if (!task) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }
    if (task.performerId !== event.context.user.id) {
      throw createError({
        statusCode: 403,
        message: 'You are not the performer of this task',
      })
    }

    await db.user.update(event.context.user.id, {
      focusedTaskId: null,
    })

    // Updating time
    await db.task.update(task.id, {})

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
