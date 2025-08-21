import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const notificationId = getRouterParam(event, 'notificationId')
    if (!notificationId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: already viewed
    const notification = await repository.notification.find(notificationId)
    if (!notification) {
      throw createError({
        statusCode: 404,
        message: 'Notification not found',
      })
    }
    if (notification.viewedAt) {
      throw createError({
        statusCode: 400,
        message: 'Notification already viewed',
      })
    }

    await repository.notification.markAsViewed(notificationId)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
