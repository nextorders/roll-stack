import type { User } from '@roll-stack/database'
import type { InitData } from '@telegram-apps/init-data-node'
import type { H3Event } from 'h3'
import process from 'node:process'
import { db } from '@roll-stack/database'
import { isValid, parse } from '@telegram-apps/init-data-node'

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

  const user = await getUserFromToken(event)

  // No auth?
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  event.context.user = user
})

async function getUserFromToken(event: H3Event): Promise<User | null> {
  try {
    const { telegram } = useRuntimeConfig()
    const botToken = process.env.NODE_ENV !== 'development' ? telegram.atriumBotToken : telegram.devBotToken

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

    const userInDB = await db.telegram.findUserByTelegramIdAndBotId(telegramData.user.id.toString(), telegram.atriumBotId)
    if (!userInDB?.user) {
      return null
    }

    return userInDB.user
  } catch (e) {
    logger.error(e)
  }

  return null
}

function validateTelegramData(authData: string, botToken: string): InitData | undefined {
  if (!isValid(authData, botToken, { expiresIn: 0 })) {
    return
  }

  return parse(authData)
}
