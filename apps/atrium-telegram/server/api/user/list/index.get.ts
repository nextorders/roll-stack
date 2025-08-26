import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Not logged in',
    })
  }

  return repository.user.list()
})
