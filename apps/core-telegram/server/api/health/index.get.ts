import { db } from '@roll-stack/database'

export default defineEventHandler(async () => {
  try {
    await db.checkHealth()

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
