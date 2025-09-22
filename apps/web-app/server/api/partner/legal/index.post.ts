import { createPartnerLegalEntitySchema } from '#shared/services/partner'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = createPartnerLegalEntitySchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const entity = await repository.partner.createLegalEntity(data)
    if (!entity?.id) {
      throw createError({
        statusCode: 400,
        message: 'Unable to create legal entity',
      })
    }

    return {
      ok: true,
      result: entity,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
