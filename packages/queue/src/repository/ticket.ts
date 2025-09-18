import type { EventMessage } from '../types'
import { usePublisher } from '../connection'
import { EXCHANGES } from '../exchanges'
import { ROUTING_KEYS } from '../queues'

export class Ticket {
  static readonly types = {
    messageCreated: 'ticketMessageCreated',
  } as const

  static async messageCreated(data: EventMessage['TicketMessageCreated']['data']) {
    const body = {
      type: Ticket.types.messageCreated,
      data,
    } satisfies EventMessage['TicketMessageCreated']

    await usePublisher().send({
      exchange: EXCHANGES.events.exchange,
      routingKey: ROUTING_KEYS.ticket.messageCreated,
    }, body)

    return body
  }
}
