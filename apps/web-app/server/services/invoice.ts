import { db } from '@roll-stack/database'

export async function recountPartnerBalance(partnerId: string) {
  const partnerInvoices = await db.invoice.listForPartner(partnerId)

  let balance = 0
  for (const invoice of partnerInvoices) {
    if (invoice.type === 'replenishment') {
      if (invoice.status === 'paid') {
        balance += invoice.total
      }

      continue
    }

    // All other invoices
    balance -= invoice.total
  }

  await db.partner.update(partnerId, {
    balance,
  })
}
