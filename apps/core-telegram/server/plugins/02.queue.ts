import process from 'node:process'
import { queue } from '@roll-stack/essence'
import { setupConsumers } from '../services/queue'

/**
 * Queue init
 */
export default defineNitroPlugin(async () => {
  if (!process.env.QUEUE_URL) {
    throw new Error('QUEUE_URL is not defined')
  }

  await queue.connect(process.env.QUEUE_URL)

  await setupConsumers()
})
