import type { Ticket, User } from '@roll-stack/database'
import type { Context } from 'grammy'
import { repository } from '@roll-stack/database'
import { Bot } from 'grammy'
import { generateAccessCode } from './common'

const S3_TELEGRAM_DIRECTORY = 'telegram/files'

const logger = useLogger('telegram:wasabi-bot')
const { telegram, public: { mediaUrl } } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateWasabiBot() {
  const token = await getBotToken()
  if (!token) {
    throw new Error('Wasabi bot is not configured')
  }

  bot = new Bot(token)

  bot.on('message:text', async (ctx) => {
    if (ctx.hasCommand('start')) {
      return handleStart(ctx)
    }

    return handleMessage(ctx)
  })

  bot.on('message:photo', async (ctx) => {
    return handlePhoto(ctx)
  })

  bot.on('message:video', async (ctx) => {
    return handleVideo(ctx)
  })

  bot.on('message:document', async (ctx) => {
    return handleFile(ctx)
  })

  bot.on('message:file', async (ctx) => {
    return handleFile(ctx)
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

  const data = await getUserAndTicket(ctx.message.from.id.toString())
  if (!data) {
    return
  }

  await repository.ticket.createMessage({
    ticketId: data.ticket.id,
    userId: data.user.id,
    text: ctx.message.text,
  })

  logger.log('message', data.user.id, ctx.message.from.id, ctx.message.text)
  ctx.reply('Сообщение передано в службу поддержки.')
}

async function handlePhoto(ctx: Context) {
  if (!ctx.message?.photo?.length) {
    return
  }

  const data = await getUserAndTicket(ctx.message.from.id.toString())
  if (!data) {
    return
  }

  const bestQuality = ctx.message.photo.pop()
  if (!bestQuality) {
    return
  }

  const fileId = bestQuality.file_id

  const botToken = await getBotToken()
  if (!botToken) {
    return null
  }

  let fileUrl

  const downloadUrl = await getFileDownloadUrl({ ctx, fileId, botToken })
  if (downloadUrl) {
    const uploaded = await uploadToStorage(downloadUrl, fileId)
    fileUrl = uploaded.fileUrl
  }

  await repository.ticket.createMessage({
    ticketId: data.ticket.id,
    userId: data.user.id,
    telegramFileId: fileId,
    fileUrl,
    fileType: 'image',
    text: ctx.message.caption ?? '',
  })

  logger.log('photo', data.user.id, ctx.message.from.id, ctx.message.caption, ctx.message.photo, downloadUrl)
  ctx.reply('Фото передано в службу поддержки.')
}

async function handleVideo(ctx: Context) {
  if (!ctx.message?.video) {
    return
  }

  const data = await getUserAndTicket(ctx.message.from.id.toString())
  if (!data) {
    return
  }

  const fileId = ctx.message.video.file_id

  const botToken = await getBotToken()
  if (!botToken) {
    return null
  }

  let fileUrl

  const downloadUrl = await getFileDownloadUrl({ ctx, fileId, botToken })
  if (downloadUrl) {
    const uploaded = await uploadToStorage(downloadUrl, fileId)
    fileUrl = uploaded.fileUrl
  }

  await repository.ticket.createMessage({
    ticketId: data.ticket.id,
    userId: data.user.id,
    telegramFileId: fileId,
    fileUrl,
    fileType: 'video',
    text: ctx.message.caption ?? '',
  })

  logger.log('video', data.user.id, ctx.message.from.id, ctx.message.caption, ctx.message.video, downloadUrl)
  ctx.reply('Видео передано в службу поддержки.')
}

async function handleFile(ctx: Context) {
  if (!ctx.message?.document) {
    return
  }

  const data = await getUserAndTicket(ctx.message.from.id.toString())
  if (!data) {
    return
  }

  const fileId = ctx.message.document.file_id

  const botToken = await getBotToken()
  if (!botToken) {
    return null
  }

  let fileUrl

  const downloadUrl = await getFileDownloadUrl({ ctx, fileId, botToken })
  if (downloadUrl) {
    const uploaded = await uploadToStorage(downloadUrl, fileId)
    fileUrl = uploaded.fileUrl
  }

  await repository.ticket.createMessage({
    ticketId: data.ticket.id,
    userId: data.user.id,
    telegramFileId: fileId,
    fileUrl,
    fileType: 'document',
    text: `${ctx.message.caption ?? ''} ${ctx.message.document?.file_name ?? ''}`,
  })

  logger.log('file', data.user.id, ctx.message.from.id, ctx.message.caption, ctx.message.document, downloadUrl)
  ctx.reply('Файл передан в службу поддержки.')
}

async function getUserAndTicket(telegramId: string): Promise<{ user: User, ticket: Ticket } | null> {
  const telegramUser = await repository.telegram.findUserByTelegramIdAndBotId(telegramId, telegram.wasabiBotId)
  if (!telegramUser?.user) {
    return null
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
    return null
  }

  return { user: telegramUser.user, ticket }
}

async function getFileDownloadUrl(data: { ctx: Context, fileId: string, botToken: string }): Promise<string | null> {
  try {
    const file = await data.ctx.api.getFile(data.fileId)
    if (!file) {
      return null
    }

    return `https://api.telegram.org/file/bot${data.botToken}/${file.file_path}`
  } catch (e) {
    logger.error('getFileDownloadUrl', e)
    return null
  }
}

async function getBotToken(): Promise<string | null> {
  const botInDb = await repository.telegram.findBot(telegram.wasabiBotId)
  if (!botInDb?.token) {
    return null
  }

  return botInDb.token
}

async function uploadToStorage(downloadUrl: string, fileId: string) {
  const extension = downloadUrl.split('.').pop()
  const buffer = await fetch(downloadUrl).then((res) => res.arrayBuffer())

  const fileInnerUri = `/${S3_TELEGRAM_DIRECTORY}/${fileId}.${extension}`
  const fileUrl = `${mediaUrl}${fileInnerUri}`

  const storage = useStorage('s3')
  await storage.setItemRaw(fileInnerUri, buffer)

  return { fileUrl }
}

export function useWasabiBot(): Bot {
  if (!bot) {
    throw new Error('Wasabi bot is not initialized. Call useCreateWasabiBot() first.')
  }

  return bot
}
