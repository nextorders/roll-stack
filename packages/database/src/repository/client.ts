import type { ClientDraft, ClientReviewDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { clientReviews, clients } from '../tables'

export class Client {
  static async find(id: string) {
    return useDatabase().query.clients.findFirst({
      where: (clients, { eq }) => eq(clients.id, id),
    })
  }

  static async findByPhone(phone: string) {
    const preparedPhone = phone.replace(/\D/g, '') // +79999999999

    return useDatabase().query.clients.findFirst({
      where: (clients, { eq }) => eq(clients.phone, preparedPhone),
    })
  }

  static async findReview(id: string) {
    return useDatabase().query.clientReviews.findFirst({
      where: (reviews, { eq }) => eq(reviews.id, id),
    })
  }

  static async findReviewIfExists(data: { kitchenId: string, name: string, date: string }) {
    return useDatabase().query.clientReviews.findFirst({
      where: (reviews, { eq, and }) => and(
        eq(reviews.kitchenId, data.kitchenId),
        eq(reviews.name, data.name),
        sql`date(${reviews.createdAt}) = date(${data.date})`, // Same date
      ),
    })
  }

  static async listReviews() {
    return useDatabase().query.clientReviews.findMany({
      orderBy: (reviews, { desc }) => desc(reviews.createdAt),
      limit: 1000,
    })
  }

  static async listReviewsOfKitchen(kitchenId: string) {
    return useDatabase().query.clientReviews.findMany({
      where: (reviews, { eq }) => eq(reviews.kitchenId, kitchenId),
    })
  }

  static async create(data: ClientDraft) {
    const [client] = await useDatabase().insert(clients).values(data).returning()
    return client
  }

  static async createReview(data: ClientReviewDraft) {
    const [review] = await useDatabase().insert(clientReviews).values(data).returning()
    return review
  }

  static async update(id: string, data: Partial<ClientDraft>) {
    const [client] = await useDatabase()
      .update(clients)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(clients.id, id))
      .returning()
    return client
  }

  static async updateReview(id: string, data: Partial<ClientReviewDraft>) {
    return useDatabase()
      .update(clientReviews)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(clientReviews.id, id))
      .returning()
  }
}
