import { repository } from '@roll-stack/database'
import { useAtriumBot } from './atrium-bot'

const { telegram } = useRuntimeConfig()

export async function generateAccessCode(): Promise<string> {
  let selectedCode

  // Code should be unique
  while (!selectedCode) {
    const code = getRandInteger(100000, 999999).toString()
    const user = await repository.telegram.findUserByKey(code)
    if (!user) {
      selectedCode = code
    }
  }

  return selectedCode
}

export async function notifyAdmin(message: string) {
  return useAtriumBot().api.sendMessage(telegram.adminId, message)
}
