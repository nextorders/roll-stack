import type { InitData } from '@telegram-apps/init-data-node'
import { parse, validate } from '@telegram-apps/init-data-node'

const logger = useLogger('telegram:validate')

export function validateTelegramData(authData: string, botToken: string): InitData | undefined {
  try {
    validate(authData, botToken, { expiresIn: 0 })
    return parse(authData)
  } catch (e) {
    logger.error(e)
  }
}
