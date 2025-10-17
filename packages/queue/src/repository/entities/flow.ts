import type { Repository } from '@nextorders/queue'
import { Entity } from '@nextorders/queue'

export class Flow extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'flow',
      eventsToConsume: [],
      repository,
    })
  }
}
