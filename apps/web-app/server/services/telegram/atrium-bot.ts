import type { Context } from 'grammy'
import { repository } from '@roll-stack/database'
import { Bot } from 'grammy'
import { generateAccessCode } from './common'

const logger = useLogger('telegram:atrium-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateAtriumBot() {
  const botInDb = await repository.telegram.findBot(telegram.atriumBotId)
  if (!botInDb?.token) {
    throw new Error('Atrium bot is not configured')
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
    logger.info('Atrium bot started successfully')
  } catch (error) {
    logger.error('Failed to start Atrium bot:', error)
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
  const telegramUser = await repository.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.atriumBotId)
  if (!telegramUser) {
    const accessKey = await generateAccessCode()

    const createdUser = await repository.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      accessKey,
      botId: telegram.atriumBotId,
    })

    logger.log('new user', createdUser?.id, ctx.message.from.id, ctx.message.text)

    await ctx.reply(`Ключ доступа: ${accessKey}`)
    return
  }

  if (!telegramUser.user) {
    await ctx.reply('Нет доступа. Используйте ранее полученный Ключ доступа.')
    return
  }

  await ctx.reply('Вы уже авторизованы.')
}

async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) {
    return
  }

  const telegramUser = await repository.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.atriumBotId)
  if (!telegramUser?.user) {
    return
  }

  logger.log('message', telegramUser.user.id, ctx.message.from.id, ctx.message.text)
  // ctx.reply('Сообщение передано в службу поддержки.')
}

export function useAtriumBot(): Bot {
  if (!bot) {
    throw new Error('Atrium bot is not initialized. Call useCreateAtriumBot() first.')
  }

  return bot
}
