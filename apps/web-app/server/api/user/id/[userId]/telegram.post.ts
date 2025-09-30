import { attachTelegramSchema } from '#shared/services/telegram'
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

    const body = await readBody(event)
    const data = attachTelegramSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const user = await db.telegram.findUserByKey(data.accessKey)
    if (!user || user.botId !== data.botId) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Guard: if accessKey is already used
    if (user.userId) {
      throw createError({
        statusCode: 400,
        message: 'Key is already used',
      })
    }

    await db.telegram.updateUser(user.id, {
      userId,
    })

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
