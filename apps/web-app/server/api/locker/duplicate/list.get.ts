import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    const duplicates = await repository.locker.listDuplicatesForUser(session.user.id)
    if (!duplicates) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return duplicates
  } catch (error) {
    throw errorResolver(error)
  }
})
