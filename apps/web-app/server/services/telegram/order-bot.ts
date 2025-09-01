import type { Context } from 'grammy'
import { createId } from '@paralleldrive/cuid2'
import { repository } from '@roll-stack/database'
import { Bot } from 'grammy'

const logger = useLogger('telegram:order-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateOrderBot() {
  const botInDb = await repository.telegram.findBot(telegram.orderBotId)
  if (!botInDb?.token) {
    throw new Error('Order bot is not configured')
  }

  bot = new Bot(botInDb.token)

  bot.on('message:text', async (ctx) => {
    if (ctx.hasCommand('start')) {
      return handleStart(ctx)
    }

    return handleMessage(ctx)
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
  const telegramUser = await repository.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser) {
    // Create Client
    const id = createId()
    const client = await repository.client.create({
      id,
      name: ctx.message.from.first_name,
      surname: ctx.message.from.last_name,
      avatarUrl: `https://atrium.sushi-love.ru/api/avatar/${id}.svg?emotion=7&gender=female`,
    })

    // Create User
    const accessKey = createId()
    const createdUser = await repository.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      accessKey,
      botId: telegram.atriumBotId,
      clientId: client.id,
    })

    logger.log('new user', createdUser?.id, ctx.message.from.id, ctx.message.text)

    await ctx.reply('Успех! Теперь вы можете совершать заказы.')
    return
  }

  if (!telegramUser.client) {
    await ctx.reply('Нет доступа. Напишите в поддержку.')
    return
  }

  await ctx.reply('Вы уже авторизованы.')
}

async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) {
    return
  }

  const telegramUser = await repository.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
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
