import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const userInDB = await db.user.find(event.context.user.id)
    if (!userInDB) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return userInDB
  } catch (error) {
    throw errorResolver(error)
  }
})
