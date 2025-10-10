import { Repository } from '@nextorders/queue'
import { Notification, Telegram, Ticket } from './entities'

class QueueRepository extends Repository {
  notification: Notification = new Notification(this)
  telegram: Telegram = new Telegram(this)
  ticket: Ticket = new Ticket(this)
}

export const repository = new QueueRepository()
