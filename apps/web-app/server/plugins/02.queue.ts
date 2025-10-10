import process from 'node:process'
import { queue } from '@roll-stack/queue'

/**
 * Queue init
 */
export default defineNitroPlugin(async () => {
  const logger = useLogger('plugin:start-queue')

  if (process.env.NODE_ENV !== 'production' && !process.env.QUEUE_URL) {
    logger.info('Skipping Queue in non-production environment')
    return
  }

  if (!process.env.QUEUE_URL) {
    throw new Error('QUEUE_URL is not defined')
  }

  await queue.connect(process.env.QUEUE_URL)
})
