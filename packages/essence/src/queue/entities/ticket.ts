import type { Repository } from '@nextorders/queue'
import { Entity } from '@nextorders/queue'

export class Ticket extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'ticket',
      eventsToConsume: [],
      repository,
    })
  }
}
