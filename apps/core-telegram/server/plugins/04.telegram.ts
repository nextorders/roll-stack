import process from 'node:process'
import { useCreateWasabiBot } from '../services/telegram/wasabi-bot'

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
    useCreateWasabiBot(),
    // useCreateAtriumBot(),
    // useCreateOrderBot(),
  ])

  logger.success('Telegram bots started successfully')
})
