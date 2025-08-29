import type { User } from '@roll-stack/database'
import type { H3Event } from 'h3'
import { repository } from '@roll-stack/database'

const logger = useLogger('middleware:auth')

const routesWithoutAuth = [
  '/api/health',
  '/api/agent', // token from headers
  '/api/auth/sign-in', // user from body
  '/api/avatar', // public
  '/api/cuid', // public
  '/api/qr', // public
]

/**
 * Cover all requests (except the ones without auth)
 */
export default defineEventHandler(async (event) => {
  // Skip routes without auth
  if (!event.path.startsWith('/api') || routesWithoutAuth.includes(event.path)) {
    return
  }

  const user = await getUserFromSession(event)

  // No auth?
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  event.context.user = user
})

async function getUserFromSession(event: H3Event): Promise<User | null> {
  try {
    const session = await getUserSession(event)
    if (!session?.user) {
      return null
    }

    const user = await repository.user.find(session.user.id)
    if (!user?.id) {
      return null
    }

    return user
  } catch (e) {
    logger.error(e)
  }

  return null
}
