import { updatePartnerLegalEntitySchema } from '#shared/services/partner'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
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

    const entity = await db.partner.findLegalEntity(entityId)
    if (!entity) {
      throw createError({
        statusCode: 404,
        message: 'Entity not found',
      })
    }

    await db.partner.updateLegalEntity(entityId, data)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
