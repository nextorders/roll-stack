import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    return repository.task.findAll()
  } catch (error) {
    throw errorResolver(error)
  }
})
