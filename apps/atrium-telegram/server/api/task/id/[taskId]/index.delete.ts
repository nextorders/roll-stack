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

    await repository.task.delete(taskId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
