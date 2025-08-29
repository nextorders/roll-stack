import { updatePartnerLegalEntitySchema } from '#shared/services/partner'
import { repository } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
    // await hasPermission(event, 'product:edit')

    const entityId = getRouterParam(event, 'entityId')
    if (!entityId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePartnerLegalEntitySchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const entity = await repository.partner.findLegalEntity(entityId)
    if (!entity) {
      throw createError({
        statusCode: 404,
        message: 'Entity not found',
      })
    }

    await repository.partner.updateLegalEntity(entityId, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
