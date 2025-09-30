import { Repository } from '@nextorders/queue'
import { Telegram, Ticket } from './entities'

class QueueRepository extends Repository {
  telegram: Telegram = new Telegram(this)
  ticket: Ticket = new Ticket(this)
}

export const repository = new QueueRepository()
