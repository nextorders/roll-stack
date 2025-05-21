import { repository } from '@sushi-atrium/database'

export default defineEventHandler(async (event) => {
  try {
    const chatId = getRouterParam(event, 'chatId')
    if (!chatId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const chat = await repository.chat.findWithEntities(chatId)
    if (!chat) {
      throw createError({
        statusCode: 404,
        message: 'Chat not found',
      })
    }

    return chat
  } catch (error) {
    throw errorResolver(error)
  }
})
