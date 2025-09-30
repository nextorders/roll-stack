import type { Repository } from '@nextorders/queue'
import { Entity } from '@nextorders/queue'
import { Events } from '../types'

export class Telegram extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'telegram',
      eventsToConsume: [
        Events.TICKET_MESSAGE_CREATED,
        Events.NOTIFICATION_USER_BEACON_ON_EPIC_COMMENT_CREATED,
      ],
      repository,
    })
  }
}
