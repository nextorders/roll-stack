import { updatePartnerSchema } from '#shared/services/partner'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    const partnerId = getRouterParam(event, 'partnerId')
    if (!partnerId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePartnerSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const partner = await repository.partner.find(partnerId)
    if (!partner) {
      throw createError({
        statusCode: 404,
        message: 'Partner not found',
      })
    }

    await repository.partner.update(partnerId, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
