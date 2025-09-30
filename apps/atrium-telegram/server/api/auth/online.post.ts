import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    await db.user.updateOnline(event.context.user.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
