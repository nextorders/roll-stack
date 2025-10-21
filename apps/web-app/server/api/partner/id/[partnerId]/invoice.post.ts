import type { Invoice } from '@roll-stack/database'
import { createPartnerInvoiceSchema } from '#shared/services/partner'
import { db } from '@roll-stack/database'
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
    const data = createPartnerInvoiceSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const partner = await db.partner.find(partnerId)
    if (!partner) {
      throw createError({
        statusCode: 404,
        message: 'Partner not found',
      })
    }

    await db.invoice.create({
      ...data,
      type: data.type as Invoice['type'],
      status: data.status as Invoice['status'],
      partnerId: partner.id,
    })

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
