import type { Repository } from '@nextorders/queue'
import { Entity } from '@nextorders/queue'
import { Events } from '../types'

export class Telegram extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'telegram',
      eventsToConsume: [
        Events.ticketMessageCreated,
        Events.notificationUserBeaconOnEpicCommentCreated,
      ],
      repository,
    })
  }
}
