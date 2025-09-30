import type { TicketMessageCreated } from '@roll-stack/essence'
import { db } from '@roll-stack/database'
import { queue } from '@roll-stack/essence'
import { useWasabiBot } from '../telegram/wasabi-bot'

const { telegram } = useRuntimeConfig()

export async function setupConsumers() {
  return queue.telegram.consume(async (msg) => {
    if (msg.type === 'ticketMessageCreated') {
      return handleTicketMessageCreated(msg as TicketMessageCreated)
    }

    return queue.ignore()
  })
}

async function handleTicketMessageCreated(msg: TicketMessageCreated) {
  try {
    // Send Telegram message to Owner user via Wasabi Bot
    const wasabiUser = await db.telegram.findUserByIdAndBotId(msg.data.ticketOwnerId, telegram.wasabiBotId)
    if (wasabiUser) {
      const text = `${msg.data.userName} ${msg.data.userSurname}: ${msg.data.userText}`
      await useWasabiBot().api.sendMessage(wasabiUser.telegramId, text)
    }

    return queue.success()
  } catch (error) {
    console.error(error)
    return queue.fail()
  }
}
