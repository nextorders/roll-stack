import { completeBonusProgramRegistrationSchema } from '#shared/services/client'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = completeBonusProgramRegistrationSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    await repository.client.updateBonusProgram(event.context.client.id, {
      ...data,
    })

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
