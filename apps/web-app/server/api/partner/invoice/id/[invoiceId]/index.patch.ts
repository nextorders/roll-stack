import type { Invoice } from '@roll-stack/database'
import { updatePartnerInvoiceSchema } from '#shared/services/partner'
import { db } from '@roll-stack/database'
import { type } from 'arktype'

export default defineEventHandler(async (event) => {
  try {
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

async function recountPartnerBalance(partnerId: string) {
  const partnerInvoices = await db.invoice.listForPartner(partnerId)

  let balance = 0
  for (const invoice of partnerInvoices) {
    if (invoice.type === 'replenishment' && invoice.status === 'paid') {
      balance += invoice.total
    }

    if (invoice.type === 'royalties') {
      balance -= invoice.total
    }
    if (invoice.type === 'other') {
      balance -= invoice.total
    }
  }

  await db.partner.update(partnerId, {
    balance,
  })
}
