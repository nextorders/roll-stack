import type { Context } from 'grammy'
import { repository } from '@roll-stack/database'
import { Bot } from 'grammy'

const logger = useLogger('telegram:wasabi-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateWasabiBot() {
  const botInDb = await repository.telegram.findBot(telegram.wasabiBotId)
  if (!botInDb?.token) {
    throw new Error('Wasabi bot is not configured')
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
    logger.info('Wasabi bot started successfully')
  } catch (error) {
    logger.error('Failed to start Wasabi bot:', error)
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
  const telegramUser = await repository.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.wasabiBotId)
  if (!telegramUser) {
    const accessKey = await generateAccessCode()

    const createdUser = await repository.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      accessKey,
      botId: telegram.wasabiBotId,
    })

    logger.log('new user', createdUser?.id, ctx.message.from.id, ctx.message.text)

    await ctx.reply(`Ключ доступа: ${accessKey}`)

    return
  }

  if (!telegramUser.user) {
    await ctx.reply('Нет доступа. Используйте ранее полученный Ключ доступа. Или передайте его в службу поддержки.')
    return
  }

  await ctx.reply('Вы уже авторизованы.')
}

async function handleMessage(ctx: Context) {
  if (!ctx.message || !ctx.message.text) {
    return
  }

  const telegramUser = await repository.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.wasabiBotId)
  if (!telegramUser?.user) {
    return
  }

  // Get last ticket
  const tickets = await repository.ticket.listOpenedByUser(telegramUser.user.id)
  let ticket = tickets?.[0]
  if (!tickets.length || !ticket) {
    // Create ticket
    ticket = await repository.ticket.create({
      title: `${telegramUser.user.name} ${telegramUser.user.surname}`,
      description: 'Создано автоматически',
      userId: telegramUser.user.id,
      status: 'opened',
    })
  }
  if (!ticket) {
    return
  }

  await repository.ticket.createMessage({
    ticketId: ticket.id,
    userId: telegramUser.user.id,
    text: ctx.message.text,
  })

  logger.log('message', telegramUser.user.id, ctx.message.from.id, ctx.message.text)
  ctx.reply('Сообщение передано в службу поддержки.')
}

export function useWasabiBot(): Bot {
  if (!bot) {
    throw new Error('Wasabi bot is not initialized. Call useCreateWasabiBot() first.')
  }

  return bot
}

export async function notifyWasabiAdmin(message: string) {
  return useWasabiBot().api.sendMessage(telegram.adminId, message)
}

async function generateAccessCode(): Promise<string> {
  let selectedCode

  // Code should be unique
  while (!selectedCode) {
    const code = getRandInteger(100000, 999999).toString()
    const user = await repository.telegram.findUserByKey(code)
    if (!user) {
      selectedCode = code
    }
  }

  return selectedCode
}
