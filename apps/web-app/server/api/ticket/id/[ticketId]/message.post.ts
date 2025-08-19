import { repository } from '@roll-stack/database'
import { type } from 'arktype'
import { useWasabiBot } from '~~/server/services/telegram/wasabi-bot'
import { createTicketMessageSchema } from '~~/shared/services/ticket'

export default defineEventHandler(async (event) => {
  try {
    const ticketId = getRouterParam(event, 'ticketId')
    if (!ticketId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const { telegram } = useRuntimeConfig()

    const body = await readBody(event)
    const data = createTicketMessageSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        message: 'Not logged in',
      })
    }

    const ticket = await repository.ticket.find(ticketId)
    if (!ticket) {
      throw createError({
        statusCode: 404,
        message: 'Ticket not found',
      })
    }

    const message = await repository.ticket.createMessage({
      ticketId,
      userId: session.user.id,
      text: data.text,
    })
    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Failed to create message',
      })
    }

    const user = await repository.user.find(session.user.id)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    const wasabiUser = await repository.telegram.findUserByIdAndBotId(ticket.userId, telegram.wasabiBotId)
    if (wasabiUser) {
      // Send message to Telegram
      const text = `${user.name} ${user.surname}: ${data.text}`
      await useWasabiBot().api.sendMessage(wasabiUser.telegramId, text)
    }

    return {
      ok: true,
      result: message,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
