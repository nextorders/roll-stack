import { Repository } from '@nextorders/queue'
import { Flow, Notification, Telegram, Ticket } from './entities'

class QueueRepository extends Repository {
  flow: Flow = new Flow(this)
  notification: Notification = new Notification(this)
  telegram: Telegram = new Telegram(this)
  ticket: Ticket = new Ticket(this)
}

export const repository = new QueueRepository()
