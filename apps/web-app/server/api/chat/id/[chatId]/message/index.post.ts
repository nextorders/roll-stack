import { createChatMessageSchema } from '#shared/services/chat'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const chatId = getRouterParam(event, 'chatId')
    if (!chatId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = createChatMessageSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const chat = await db.chat.findWithEntities(chatId)
    if (!chat) {
      throw createError({
        statusCode: 404,
        message: 'Chat not found',
      })
    }

    const message = await db.chat.createMessage({
      chatId,
      userId: event.context.user.id,
      text: data.text,
    })
    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Failed to create message',
      })
    }

    // Last message in chat
    await db.chat.update(chat.id, {
      lastMessageId: message.id,
    })

    return {
      ok: true,
      result: message,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
