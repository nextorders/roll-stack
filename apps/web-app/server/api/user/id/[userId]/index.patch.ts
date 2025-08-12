import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { updateUserSchema } from '~~/shared/services/user'

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
    const user = await repository.user.find(userId)
    if (!user?.id) {
      throw createError({
        statusCode: 400,
        message: 'User already have info',
      })
    }

    // Guard: if no user in session
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    const body = await readBody(event)
    const data = updateUserSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const updatedUser = await repository.user.update(userId, data)

    return {
      ok: true,
      result: updatedUser,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
