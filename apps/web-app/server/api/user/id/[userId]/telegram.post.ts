import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { attachTelegramSchema } from '~~/shared/services/telegram'

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

    const user = await repository.telegram.findUserByIdAndBotId(userId, data.botId)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Guard: if accessKey is not correct
    if (user.accessKey !== data.accessKey) {
      throw createError({
        statusCode: 400,
        message: 'Key is not correct',
      })
    }

    await repository.telegram.updateUser(user.id, {
      userId,
    })

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
