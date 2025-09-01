import type { Client } from '@roll-stack/database'
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
  const telegramUser = await repository.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser) {
    // Get phone number
    await ctx.reply(
      `Всего один шаг — подтвердите номер телефона 📱👇\n\n_Продолжая, вы подтверждаете своё согласие на [сбор и обработку персональных данных](https://sushi-love.ru), а также принимаете условия [Пользовательского соглашения](https://sushi-love.ru)_`,
      {
        parse_mode: 'MarkdownV2',
        link_preview_options: {
          is_disabled: true,
        },
        reply_markup: {
          keyboard: [[{ text: 'Подтвердить номер', request_contact: true }]],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      },
    )
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

  const telegramUser = await repository.telegram.findClientByTelegramIdAndBotId(ctx.message.from.id.toString(), telegram.orderBotId)
  if (!telegramUser?.id) {
    const telegramUser = await repository.telegram.createUser({
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

    await ctx.reply('Успех! Теперь вы можете совершать заказы.', {
      reply_markup: {
        keyboard: [],
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

async function findOrCreateClient(phone: string, user: { name: string, surname: string | undefined }): Promise<Client> {
  const client = await repository.client.findByPhone(phone)
  if (!client) {
    const id = createId()
    return repository.client.create({
      id,
      phone,
      name: user.name,
      surname: user.surname,
      avatarUrl: `https://atrium.sushi-love.ru/api/avatar/${id}.svg?emotion=7&gender=female`,
    })
  }

  return client
}
