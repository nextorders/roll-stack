import type { EventHandlerMap, NotificationUserBeaconOnEpicCommentCreated, TicketMessageCreated } from '@roll-stack/queue'
import { db } from '@roll-stack/database'
import { queue } from '@roll-stack/queue'
import { useAtriumBot } from '../telegram/atrium-bot'
import { useWasabiBot } from '../telegram/wasabi-bot'

const { telegram } = useRuntimeConfig()

export async function setupConsumers() {
  return queue.consume<EventHandlerMap>(queue.telegram.name, {
    ticketMessageCreated: handleTicketMessageCreated,
    notificationUserBeaconOnEpicCommentCreated: handleUserBeaconOnEpicCommentCreated,
  })
}

async function handleTicketMessageCreated(data: TicketMessageCreated['data']): Promise<boolean> {
  try {
    // Send Telegram message to Owner user via Wasabi Bot
    const wasabiUser = await db.telegram.findUserByIdAndBotId(data.ticketOwnerId, telegram.wasabiBotId)
    if (wasabiUser) {
      const text = `${data.userName} ${data.userSurname}: ${data.userText}`
      await useWasabiBot().api.sendMessage(wasabiUser.telegramId, text)
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

async function handleUserBeaconOnEpicCommentCreated(data: NotificationUserBeaconOnEpicCommentCreated['data']): Promise<boolean> {
  try {
    // Send Telegram message to Atrium user
    const atriumUser = await db.telegram.findUserByIdAndBotId(data.userId, telegram.atriumBotId)
    if (atriumUser) {
      const separator = 'zzzzz'
      const startAppData = `epic${separator}${data.epicId}`

      await useAtriumBot()
        .api
        .sendMessage(
          atriumUser.telegramId,
          `👋 ${data.senderName} ${data.senderSurname}\n${data.title}\n\n${data.description}`,
          {
            reply_markup: {
              inline_keyboard: [[{
                text: 'Открыть эпик',
                url: `https://t.me/sushi_atrium_bot/app?startapp=${startAppData}`,
              }]],
            },
          },
        )
    }

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
