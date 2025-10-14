import type { User } from '@roll-stack/database'
import type { Context } from 'grammy'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@roll-stack/database'
import { Bot } from 'grammy'
import { generateAccessCode, getBotToken, getFileDownloadUrl, requestContactPhone, uploadToStorage } from './common'

const logger = useLogger('telegram:atrium-bot')
const { telegram } = useRuntimeConfig()

let bot: Bot | null = null

export async function useCreateAtriumBot() {
  const token = await getBotToken(telegram.atriumBotId)
  if (!token) {
    throw new Error('Atrium bot is not configured')
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
  const telegramUser = await db.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.atriumBotId)
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

  const user = await findOrCreateAtriumUser({
    phone: ctx.message.contact.phone_number,
    user: {
      name: ctx.message.from.first_name,
      surname: ctx.message.from.last_name,
    },
    ctx,
    botToken,
  })

  const telegramUser = await db.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.atriumBotId)
  if (!telegramUser?.id) {
    const accessKey = await generateAccessCode()

    const telegramUser = await db.telegram.createUser({
      telegramUserType: ctx.message.chat.type,
      telegramId: ctx.message.from.id.toString(),
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      botId: telegram.atriumBotId,
      accessKey,
      userId: user.id,
    })

    logger.log('new user', telegramUser)

    await ctx.setChatMenuButton({
      chat_id: ctx.message.chat.id,
      menu_button: {
        type: 'web_app',
        text: 'Атриум',
        web_app: {
          url: 'https://t.me/sushi_atrium_bot/app',
        },
      },
    })

    await ctx.reply(`Успех! Теперь вы можете войти в Атриум. Ваш ключ доступа: ${accessKey}`, {
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

  const telegramUser = await db.telegram.findUserByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.atriumBotId)
  if (!telegramUser?.user) {
    return
  }

  logger.log('message', telegramUser.user.id, ctx.message.from.id, ctx.message.text)
  // ctx.reply('Сообщение передано в службу поддержки.')
}

async function getAndUploadUserPhoto(ctx: Context, botToken: string): Promise<string | null> {
  if (!ctx.message?.from.id) {
    return null
  }

  const photos = await ctx.api.getUserProfilePhotos(ctx.message.from.id)
  const userPhoto = photos.photos[0]?.pop()
  if (userPhoto?.file_id) {
    const fileDownloadUrl = await getFileDownloadUrl({ ctx, fileId: userPhoto.file_id, botToken })
    if (fileDownloadUrl) {
      const uploaded = await uploadToStorage(fileDownloadUrl, userPhoto.file_id)

      return uploaded?.fileUrl ?? null
    }
  }

  return null
}

async function findOrCreateAtriumUser(data: { phone: string, user: { name: string, surname: string | undefined }, ctx: Context, botToken: string }): Promise<User> {
  const userInDB = await db.user.findByPhone(data.phone)
  if (!userInDB) {
    const id = createId()
    const defaultAvatarUrl = `https://avatar.nextorders.ru/${id}?emotion=7&gender=female`

    // User photo
    const avatarUrl = await getAndUploadUserPhoto(data.ctx, data.botToken)
    logger.log('New user avatar', avatarUrl)

    return db.user.create({
      id,
      phone: data.phone,
      type: 'staff',
      name: data.user.name,
      surname: data.user.surname,
      avatarUrl: avatarUrl ?? defaultAvatarUrl,
    })
  }

  return userInDB
}

export function useAtriumBot(): Bot {
  if (!bot) {
    throw new Error('Atrium bot is not initialized. Call useCreateAtriumBot() first.')
  }

  return bot
}
