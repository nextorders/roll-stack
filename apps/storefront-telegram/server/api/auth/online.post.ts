import { repository } from '@roll-stack/database'

export default defineEventHandler(async (event) => {
  try {
    await repository.client.updateOnline(event.context.client.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
