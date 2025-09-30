import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId')
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: if no user
    const user = await db.user.find(userId)
    if (!user?.id) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Guard: if not this user
    if (event.context.user.id !== userId) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden',
      })
    }

    await db.user.updateOnline(userId)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
