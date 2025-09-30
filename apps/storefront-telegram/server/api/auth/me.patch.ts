import { updateClientSchema } from '#shared/services/client'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = updateClientSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    await db.client.update(event.context.client.id, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
