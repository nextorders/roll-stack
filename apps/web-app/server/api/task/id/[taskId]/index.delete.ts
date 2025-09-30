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

    await db.task.delete(taskId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
