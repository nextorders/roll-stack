import type { NotificationOption } from '@roll-stack/database'
import { updateUserSchema } from '#shared/services/user'
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

    // Guard: if no user
    const user = await db.user.find(userId)
    if (!user?.id) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    const body = await readBody(event)
    const data = updateUserSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const updatedUser = await db.user.update(userId, {
      ...data,
      notifications: data.notifications as NotificationOption[],
    })

    return {
      ok: true,
      result: updatedUser,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
