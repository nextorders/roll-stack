import type { Repository } from '@nextorders/queue'
import type { TicketMessageCreated } from './../types'
import { Entity } from '@nextorders/queue'
import { Events } from './../types'

export class Ticket extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'ticket',
      eventsToConsume: [],
      repository,
    })
  }

  async messageCreated(data: TicketMessageCreated['data']): Promise<TicketMessageCreated> {
    const body = {
      type: Events.TICKET_MESSAGE_CREATED,
      data,
    } as const

    await this.repository.publisher.send({
      exchange: this.repository.exchanges.events.exchange,
      routingKey: Events.TICKET_MESSAGE_CREATED,
    }, body)

    return body
  }
}
