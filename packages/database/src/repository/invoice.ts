import type { InvoiceDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { invoices } from '../tables'

export class Invoice {
  static async find(id: string) {
    return useDatabase().query.invoices.findFirst({
      where: (invoices, { eq }) => eq(invoices.id, id),
    })
  }

  static async listForPartner(partnerId: string) {
    return useDatabase().query.invoices.findMany({
      where: (invoices, { eq }) => eq(invoices.partnerId, partnerId),
    })
  }

  static async create(data: InvoiceDraft) {
    const [invoice] = await useDatabase().insert(invoices).values(data).returning()
    return invoice
  }

  static async update(id: string, data: Partial<InvoiceDraft>) {
    const [invoice] = await useDatabase()
      .update(invoices)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(invoices.id, id))
      .returning()
    return invoice
  }

  static async delete(id: string) {
    return useDatabase().delete(invoices).where(eq(invoices.id, id))
  }
}
