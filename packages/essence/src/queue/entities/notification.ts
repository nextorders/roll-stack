import type { Repository } from '@nextorders/queue'
import type { NotificationUserBeaconOnEpicCommentCreated } from '../types'
import { Entity } from '@nextorders/queue'
import { Events } from '../types'

export class Notification extends Entity {
  constructor(repository: Repository) {
    super({
      name: 'notification',
      eventsToConsume: [],
      repository,
    })
  }

  async userBeaconOnEpicCommentCreated(data: NotificationUserBeaconOnEpicCommentCreated['data']): Promise<NotificationUserBeaconOnEpicCommentCreated> {
    const body = {
      type: Events.NOTIFICATION_USER_BEACON_ON_EPIC_COMMENT_CREATED,
      data,
    } as const

    await this.repository.publisher.send({
      exchange: this.repository.exchanges.events.exchange,
      routingKey: Events.NOTIFICATION_USER_BEACON_ON_EPIC_COMMENT_CREATED,
    }, body)

    return body
  }
}
