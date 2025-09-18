import process from 'node:process'
import { useCreateConnection } from '@roll-stack/queue'

/**
 * Queue init
 */
export default defineNitroPlugin(async () => {
  if (!process.env.QUEUE_URL) {
    throw new Error('QUEUE_URL is not defined')
  }

  await useCreateConnection(process.env.QUEUE_URL)
})
