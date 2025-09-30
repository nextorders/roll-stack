import type { User } from '@roll-stack/database'
import type { H3Event } from 'h3'
import { db } from '@roll-stack/database'

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
    const authToken = getHeader(event, 'Authorization') ?? getHeader(event, 'authorization')
    if (!authToken) {
      return null
    }

    const [_, token] = authToken.split(' ')
    if (!token) {
      return null
    }

    const user = await db.user.find(token)
    if (!user?.id) {
      return null
    }

    return user
  } catch (e) {
    logger.error(e)
  }

  return null
}
