import type { Invoice } from '@roll-stack/database'
import { updatePartnerInvoiceSchema } from '#shared/services/partner'
import { db } from '@roll-stack/database'
import { type } from 'arktype'
import { recountPartnerBalance } from '~~/server/services/invoice'

export default defineEventHandler(async (event) => {
  try {
    hasPermission(event.context.user, 'partner:invoice:edit')

    const invoiceId = getRouterParam(event, 'invoiceId')
    if (!invoiceId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const body = await readBody(event)
    const data = updatePartnerInvoiceSchema(body)
    if (data instanceof type.errors) {
      throw data
    }

    const invoice = await db.invoice.find(invoiceId)
    if (!invoice) {
      throw createError({
        statusCode: 404,
        message: 'Invoice not found',
      })
    }

    await db.invoice.update(invoiceId, {
      ...data,
      type: data.type as Invoice['type'],
      status: data.status as Invoice['status'],
    })

    // Recount partner balance
    const partner = await db.partner.find(invoice.partnerId ?? '')
    if (!partner) {
      throw createError({
        statusCode: 404,
        message: 'Partner not found',
      })
    }

    await recountPartnerBalance(partner.id)

    return {
      ok: true,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
