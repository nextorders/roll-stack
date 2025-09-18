import type { EventMessage } from '@roll-stack/queue'
import { repository } from '@roll-stack/database'
import { CONSUMER_ANSWER, repository as queue, QUEUES, useConnection } from '@roll-stack/queue'
import { useWasabiBot } from '../telegram/wasabi-bot'

const { telegram } = useRuntimeConfig()

export async function setupConsumers() {
  const sub = useConnection().createConsumer({
    queue: QUEUES.telegram.queue,
    queueOptions: {
      passive: true,
    },
    noAck: false,
    qos: {
      prefetchCount: 1,
    },
  }, async (msg) => {
    if (msg.body.type === queue.ticket.types.messageCreated) {
      return handleTicketMessageCreated(msg.body as EventMessage['TicketMessageCreated'])
    }

    return CONSUMER_ANSWER.IGNORE
  })

  sub.on('error', (err) => {
    // Maybe the consumer was cancelled, or the connection was reset before a
    // message could be acknowledged.
    console.error('consumer error (user-events)', err)
  })
}

async function handleTicketMessageCreated(msg: EventMessage['TicketMessageCreated']) {
  try {
    // Send Telegram message to Owner user via Wasabi Bot
    const wasabiUser = await repository.telegram.findUserByIdAndBotId(msg.data.ticketOwnerId, telegram.wasabiBotId)
    if (wasabiUser) {
      const text = `${wasabiUser.user?.name} ${wasabiUser.user?.surname}: ${msg.data.userText}`
      await useWasabiBot().api.sendMessage(wasabiUser.telegramId, text)
    }

    return CONSUMER_ANSWER.SUCCESS
  } catch (error) {
    console.error(error)
    return CONSUMER_ANSWER.FAIL
  }
}
