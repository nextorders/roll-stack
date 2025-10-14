import type { Context } from 'grammy'
import fs from 'node:fs/promises'
import { db } from '@roll-stack/database'
import { useAtriumBot } from './atrium-bot'

const S3_TELEGRAM_DIRECTORY = 'telegram/files'

const { telegram, public: { mediaUrl } } = useRuntimeConfig()

const logger = useLogger('telegram:common')

export async function getBotToken(botId: string): Promise<string | null> {
  const botInDb = await db.telegram.findBot(botId)
  if (!botInDb?.token) {
    return null
  }

  return botInDb.token
}

export async function generateAccessCode(): Promise<string> {
  let selectedCode

  // Code should be unique
  while (!selectedCode) {
    const code = getRandInteger(100000, 999999).toString()
    const user = await db.telegram.findUserByKey(code)
    if (!user) {
      selectedCode = code
    }
  }

  return selectedCode
}

export async function notifyAdmin(message: string) {
  return useAtriumBot().api.sendMessage(telegram.adminId, message)
}

export async function requestContactPhone(ctx: Context) {
  return ctx.reply(
    `Всего один шаг — подтвердите номер телефона 📱👇\n\n_Продолжая, вы подтверждаете своё согласие на [сбор и обработку персональных данных](https://sushi-love.ru), а также принимаете условия [Пользовательского соглашения](https://sushi-love.ru)_`,
    {
      parse_mode: 'MarkdownV2',
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: {
        keyboard: [
          [{ text: 'Подтвердить номер', request_contact: true }],
        ],
        resize_keyboard: true,
      },
    },
  )
}

export async function uploadToStorage(downloadUrl: string, fileId: string) {
  try {
    const extension = downloadUrl.split('.').pop()

    let buffer

    if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
      // Download file
      const response = await fetch(downloadUrl)
      buffer = await response.arrayBuffer()
    } else {
      // Read file
      buffer = await fs.readFile(downloadUrl)
    }

    if (!buffer) {
      return null
    }

    const fileInnerUri = `/${S3_TELEGRAM_DIRECTORY}/${fileId}.${extension}`
    const fileUrl = `${mediaUrl}${fileInnerUri}`

    const storage = useStorage('s3')
    await storage.setItemRaw(fileInnerUri, buffer)

    return { fileUrl }
  } catch (e) {
    logger.error('uploadToStorage', e)
    return null
  }
}

export async function getFileDownloadUrl(data: { ctx: Context, fileId: string, botToken: string, isLocalBot: boolean }): Promise<string | null> {
  try {
    const file = await data.ctx.api.getFile(data.fileId)
    if (!file?.file_path) {
      return null
    }

    // as /var/lib/bot/token/documents/file_id.ext
    if (data.isLocalBot) {
      return file.file_path
    }

    // or from telegram api
    return `https://api.telegram.org/file/bot${data.botToken}/${file.file_path}`
  } catch (e) {
    logger.error('getFileDownloadUrl', e)
    return null
  }
}
