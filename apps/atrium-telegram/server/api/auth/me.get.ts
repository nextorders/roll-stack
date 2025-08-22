import process from 'node:process'
import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const { telegram } = useRuntimeConfig()
    const botToken = process.env.NODE_ENV !== 'development' ? telegram.atriumBotToken : telegram.devBotToken

    const token = getHeader(event, 'Authorization')
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const [_, authData] = token.split(' ')
    if (!authData) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const telegramData = validateTelegramData(authData, botToken)
    if (!telegramData?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegramData.user.id.toString()

    const userInDB = await repository.telegram.findUserByTelegramIdAndBotId(telegramId, telegram.atriumBotId)
    if (!userInDB?.user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    return userInDB.user
  } catch (error) {
    throw errorResolver(error)
  }
})
