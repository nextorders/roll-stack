import type { Client } from '@roll-stack/database'
import type { InitData } from '@telegram-apps/init-data-node'
import type { H3Event } from 'h3'
import process from 'node:process'
import { repository } from '@roll-stack/database'
import { parse, validate } from '@telegram-apps/init-data-node'

const logger = useLogger('middleware:auth')

const routesWithoutAuth = [
  '/api/health',
]

/**
 * Cover all requests (except the ones without auth)
 */
export default defineEventHandler(async (event) => {
  // Skip if preflight
  if (event.method === 'OPTIONS') {
    return
  }

  // Skip routes without auth
  if (!event.path.startsWith('/api') || routesWithoutAuth.includes(event.path)) {
    return
  }

  const client = await getClientFromToken(event)

  // No auth?
  if (!client) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  event.context.client = client
})

async function getClientFromToken(event: H3Event): Promise<Client | null> {
  try {
    const { telegram } = useRuntimeConfig()
    const botToken = process.env.NODE_ENV !== 'development' ? telegram.orderBotToken : telegram.devBotToken

    const token = getHeader(event, 'Authorization') ?? getHeader(event, 'authorization')
    if (!token) {
      return null
    }

    const [_, authData] = token.split(' ')
    if (!authData) {
      return null
    }

    const telegramData = validateTelegramData(authData, botToken)
    if (!telegramData?.user) {
      return null
    }

    const clientInDB = await repository.telegram.findClientByTelegramIdAndBotId(telegramData.user.id.toString(), telegram.orderBotId)
    if (!clientInDB?.client) {
      return null
    }

    return clientInDB.client
  } catch (e) {
    logger.error(e)
  }

  return null
}

function validateTelegramData(authData: string, botToken: string): InitData | undefined {
  validate(authData, botToken, { expiresIn: 0 })
  return parse(authData)
}
