import { completeUserSchema } from '#shared/services/user'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId')
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    // Guard: if user already have phone
    const user = await db.user.find(userId)
    if (user?.phone) {
      throw createError({
        statusCode: 400,
        message: 'User already have info',
      })
    }

    const body = await readBody(event)
    const data = completeUserSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const updatedUser = await db.user.update(userId, {
      ...data,
    })

    return {
      ok: true,
      result: updatedUser,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
