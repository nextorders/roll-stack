import { updatePartnerAgreementSchema } from '#shared/services/partner'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const agreementId = getRouterParam(event, 'agreementId')
    if (!agreementId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePartnerAgreementSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const agreement = await repository.partner.findAgreement(agreementId)
    if (!agreement) {
      throw createError({
        statusCode: 404,
        message: 'Agreement not found',
      })
    }

    await repository.partner.updateAgreement(agreementId, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
