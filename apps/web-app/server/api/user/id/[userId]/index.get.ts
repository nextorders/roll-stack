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

    const user = await db.user.find(userId)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return user
  } catch (error) {
    throw errorResolver(error)
  }
})
