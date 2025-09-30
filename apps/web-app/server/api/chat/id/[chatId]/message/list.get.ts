import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    const chatId = getRouterParam(event, 'chatId')
    if (!chatId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    return db.chat.listMessages(chatId)
  } catch (error) {
    throw errorResolver(error)
  }
})
