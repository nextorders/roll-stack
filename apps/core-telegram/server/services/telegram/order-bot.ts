import type { Client } from '@roll-stack/database'
import type { Context } from 'grammy'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@roll-stack/database'
import { Bot } from 'grammy'
import { getBotToken, requestContactPhone } from './common'

const logger = useLogger('telegram:order-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateOrderBot() {
  const token = await getBotToken(telegram.orderBotId)
  if (!token) {
    throw new Error('Order bot is not configured')
  }

  bot = new Bot(token)

  bot.on('message:text', async (ctx) => {
    if (ctx.hasCommand('start')) {
      return handleStart(ctx)
    }

    return handleMessage(ctx)
  })

  // User shared contact
  bot.on('message:contact', async (ctx) => {
    return handleContact(ctx)
  })

  // Somebody invited bot to a group
  bot.on('my_chat_member', async (ctx) => {
    logger.log('my_chat_member', ctx.update)
  })

  try {
    await bot.start()
    logger.info('Order bot started successfully')
  } catch (error) {
    logger.error('Failed to start Order bot:', error)
    throw error
  }
}

async function handleStart(ctx: Context) {
  if (!ctx.message) {
    return
  }

  // Not private chat?
  if (ctx.message.chat.type !== 'private') {
    await ctx.reply('Я пока не умею отвечать на групповые сообщения.')
    return
  }

  // Find user
  const telegramUser = await db.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser) {
    // Request phone number from user
    await requestContactPhone(ctx)
    return
  }

  if (!telegramUser.client) {
    await ctx.reply('Нет доступа. Напишите в поддержку.')
    return
  }

  await ctx.reply('Вы уже авторизованы.')
}

async function handleContact(ctx: Context) {
  if (!ctx.message?.contact) {
    return
  }

  // Not private chat?
  if (ctx.message.chat.type !== 'private') {
    await ctx.reply('Я пока не умею отвечать на групповые сообщения.')
    return
  }

  // Find Client
  const client = await findOrCreateClient(ctx.message.contact.phone_number, {
    name: ctx.message.from.first_name,
    surname: ctx.message.from.last_name,
  })

  const telegramUser = await db.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser?.id) {
    const telegramUser = await db.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      botId: telegram.orderBotId,
      accessKey: createId(),
      clientId: client.id,
    })

    logger.log('new user', telegramUser)

    await ctx.setChatMenuButton({
      chat_id: ctx.message.chat.id,
      menu_button: {
        type: 'web_app',
        text: 'Заказать',
        web_app: {
          url: 'https://t.me/sushi_love_order_bot/app',
        },
      },
    })

    await ctx.reply('Успех! Теперь вы можете совершать заказы.', {
      reply_markup: {
        remove_keyboard: true,
      },
    })
    return
  }

  await ctx.reply('Номер уже подтвержден.')
}

async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) {
    return
  }

  const telegramUser = await db.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser?.client) {
    return
  }

  logger.log('message', telegramUser.client.id, ctx.message.from.id, ctx.message.text)
  // ctx.reply('Сообщение передано в службу поддержки.')
}

export function useOrderBot(): Bot {
  if (!bot) {
    throw new Error('Order bot is not initialized. Call useCreateOrderBot() first.')
  }

  return bot
}

async function findOrCreateClient(phone: string, user: { name: string, surname: string | undefined }): Promise<Client> {
  const client = await db.client.findByPhone(phone)
  if (!client) {
    const id = createId()
    const baseLevelId = 'hvccipw6t467rw3kxkujj1j8'

    return db.client.create({
      id,
      phone,
      levelId: baseLevelId,
      name: user.name,
      surname: user.surname,
      avatarUrl: `https://avatar.nextorders.ru/${id}?emotion=7&gender=female`,
    })
  }

  return client
}
