import { db } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    await db.client.updateOnline(event.context.client.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
