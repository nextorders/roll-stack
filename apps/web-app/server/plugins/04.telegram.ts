import process from 'node:process'
import { useCreateAtriumBot } from '../services/telegram/atrium-bot'
import { useCreateOrderBot } from '../services/telegram/order-bot'

export default defineNitroPlugin(async () => {
  const logger = useLogger('plugin:start-telegram')

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Skipping Telegram in non-production environment')
    return
  }

  const { telegram } = useRuntimeConfig()

  if (!telegram.wasabiBotId || !telegram.atriumBotId) {
    // No config provided
    return
  }

  // Start the bots (using long polling)
  await Promise.all([
    useCreateAtriumBot(),
    useCreateOrderBot(),
  ])

  logger.success('Telegram bots started successfully')
})
