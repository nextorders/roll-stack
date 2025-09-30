import type { NotificationUserBeaconOnEpicCommentCreated, TicketMessageCreated } from '@roll-stack/essence'
import { db } from '@roll-stack/database'
import { queue } from '@roll-stack/essence'
import { useAtriumBot } from '../telegram/atrium-bot'
import { useWasabiBot } from '../telegram/wasabi-bot'

const { telegram } = useRuntimeConfig()

export async function setupConsumers() {
  return queue.telegram.consume(async (msg) => {
    if (msg.type === 'ticketMessageCreated') {
      return handleTicketMessageCreated(msg as TicketMessageCreated)
    }
    if (msg.type === 'notificationUserBeaconOnEpicCommentCreated') {
      return handleUserBeaconOnEpicCommentCreated(msg as NotificationUserBeaconOnEpicCommentCreated)
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

async function handleUserBeaconOnEpicCommentCreated(msg: NotificationUserBeaconOnEpicCommentCreated) {
  try {
    // Send Telegram message to Atrium user
    const atriumUser = await db.telegram.findUserByIdAndBotId(msg.data.userId, telegram.atriumBotId)
    if (atriumUser) {
      const separator = 'zzzzz'
      const startAppData = `epic${separator}${msg.data.epicId}`

      await useAtriumBot()
        .api
        .sendMessage(
          atriumUser.telegramId,
          `👋 ${msg.data.senderName} ${msg.data.senderSurname}\n${msg.data.title}\n\n${msg.data.description}`,
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

    return queue.success()
  } catch (error) {
    console.error(error)
    return queue.fail()
  }
}
