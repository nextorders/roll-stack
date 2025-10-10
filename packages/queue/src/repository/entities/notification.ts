import type { Repository } from '@nextorders/queue'
import { Entity } from '@nextorders/queue'

export class Notification extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'notification',
      eventsToConsume: [],
      repository,
    })
  }
}
