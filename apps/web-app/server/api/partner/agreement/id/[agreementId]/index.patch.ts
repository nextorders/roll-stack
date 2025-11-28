import { updatePartnerAgreementSchema } from '#shared/services/partner'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'partner:agreement:edit')

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

    const agreement = await db.partner.findAgreement(agreementId)
    if (!agreement) {
      throw createError({
        statusCode: 404,
        message: 'Agreement not found',
      })
    }

    await db.partner.updateAgreement(agreementId, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
