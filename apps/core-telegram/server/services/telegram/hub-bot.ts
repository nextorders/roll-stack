import type { User } from '@roll-stack/database'
import type { Context } from 'grammy'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@roll-stack/database'
import { Bot } from 'grammy'
import { generateAccessCode, getBotToken, requestContactPhone } from './common'

const logger = useLogger('telegram:hub-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateHubBot() {
  const token = await getBotToken(telegram.wasabiBotId)
  if (!token) {
    throw new Error('Hub bot is not configured')
  }

  bot = new Bot(token, {
    client: { apiRoot: telegram.localBotApiServerUrl },
  })

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
    logger.info('Hub bot started successfully')
  } catch (error) {
    logger.error('Failed to start Hub bot:', error)
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
  const telegramUser = await db.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.wasabiBotId)
  if (!telegramUser) {
    // Request phone number from user
    await requestContactPhone(ctx)
    return
  }

  if (!telegramUser.user || !telegramUser.user.isActive) {
    await ctx.reply('Нет доступа. Используйте ранее полученный Ключ доступа.')
    return
  }

  await ctx.reply('Вы уже авторизованы.')
}

async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) {
    return
  }

  const telegramUser = await db.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.wasabiBotId)
  if (!telegramUser?.user) {
    return
  }

  logger.log('message', telegramUser.user.id, ctx.message.from.id, ctx.message.text)
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

  const botToken = await getBotToken(telegram.wasabiBotId)
  if (!botToken) {
    return null
  }

  const phone = ctx.message.contact.phone_number.replace(/\D/g, '')
  const user = await findOrCreateHubUser({
    phone,
    user: {
      name: ctx.message.from.first_name,
      surname: ctx.message.from.last_name,
    },
    ctx,
    botToken,
  })

  const telegramUser = await db.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.wasabiBotId)
  if (!telegramUser?.id) {
    const accessKey = await generateAccessCode()

    const createdTelegramUser = await db.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      botId: telegram.wasabiBotId,
      accessKey,
      userId: user.id,
    })

    logger.log('New Telegram user', createdTelegramUser)

    await ctx.setChatMenuButton({
      chat_id: ctx.message.chat.id,
      menu_button: {
        type: 'web_app',
        text: 'Хаб',
        web_app: {
          url: 'https://t.me/wasabi_hub_bot/app',
        },
      },
    })

    await ctx.reply(`🎉 Успех! Через этого бота вы можете открыть Хаб. Это место, в котором мы проводим события и делимся полезной информацией.`, {
      reply_markup: {
        remove_keyboard: true,
      },
    })
    return
  }

  await ctx.reply('Номер уже подтвержден.')
}

async function findOrCreateHubUser(data: { phone: string, user: { name: string, surname: string | undefined }, ctx: Context, botToken: string }): Promise<User> {
  const userInDB = await db.user.findByPhone(data.phone)
  if (!userInDB) {
    const id = createId()
    const avatarUrl = `https://avatar.nextorders.ru/${id}?emotion=7&gender=female`

    const createdUser = await db.user.create({
      id,
      phone: data.phone,
      type: 'prospective_partner',
      name: data.user.name,
      surname: data.user.surname,
      avatarUrl,
      gender: 'female',
      caption: 'Новый пользователь',
    })
    logger.log('New prospective partner', createdUser)

    return createdUser
  }

  return userInDB
}

export function useHubBot(): Bot {
  if (!bot) {
    throw new Error('Hub bot is not initialized. Call useCreateHubBot() first.')
  }

  return bot
}
