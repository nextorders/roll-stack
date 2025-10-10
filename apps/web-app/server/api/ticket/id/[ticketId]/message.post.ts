import type { TicketMessageCreated } from '@roll-stack/queue'
import { createTicketMessageSchema } from '#shared/services/ticket'
import { db } from '@roll-stack/database'
import { Events, queue } from '@roll-stack/queue'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const ticketId = getRouterParam(event, 'ticketId')
    if (!ticketId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = createTicketMessageSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const ticket = await db.ticket.find(ticketId)
    if (!ticket) {
      throw createError({
        statusCode: 404,
        message: 'Ticket not found',
      })
    }

    const message = await db.ticket.createMessage({
      ticketId,
      userId: event.context.user.id,
      text: data.text,
    })
    if (!message) {
      throw createError({
        statusCode: 400,
        message: 'Failed to create message',
      })
    }

    // Push Event
    await queue.publish<TicketMessageCreated>(Events.ticketMessageCreated, {
      ticketId: message.ticketId,
      ticketOwnerId: ticket.userId,
      messageId: message.id,
      userId: message.userId,
      userName: event.context.user.name,
      userSurname: event.context.user.surname,
      userText: message.text,
    })

    return {
      ok: true,
      result: message,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
