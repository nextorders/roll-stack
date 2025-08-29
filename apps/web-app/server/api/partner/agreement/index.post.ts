import { createPartnerAgreementSchema } from '#shared/services/partner'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    // await hasPermission(event, 'product:delete')

    const body = await readBody(event)
    const data = createPartnerAgreementSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const agreement = await repository.partner.createAgreement(data)
    if (!agreement?.id) {
      throw createError({
        statusCode: 400,
        message: 'Unable to create',
      })
    }

    return {
      ok: true,
      result: agreement,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
