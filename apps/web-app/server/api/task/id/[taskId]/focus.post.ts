import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const taskId = getRouterParam(event, 'taskId')
    if (!taskId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const user = await repository.user.find(event.context.user.id)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Guards:
    // If task not exist
    // If performer is not user
    // If already focused
    const task = await repository.task.find(taskId)
    if (!task) {
      throw createError({
        statusCode: 404,
        message: 'Task not found',
      })
    }
    if (task.performerId !== user.id) {
      throw createError({
        statusCode: 403,
        message: 'You are not the performer of this task',
      })
    }
    if (user.focusedTaskId === taskId) {
      throw createError({
        statusCode: 400,
        message: 'Task already focused',
      })
    }

    await repository.user.update(user.id, {
      focusedTaskId: taskId,
    })

    // Updating time
    await repository.task.update(task.id, {})

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
