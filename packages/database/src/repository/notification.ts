import type { NotificationDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { notifications } from '../tables'

export class Notification {
  static async find(id: string) {
    return useDatabase().query.notifications.findFirst({
      where: (notifications, { eq }) => eq(notifications.id, id),
    })
  }

  static async listByUser(userId: string) {
    return useDatabase().query.notifications.findMany({
      where: (notifications, { eq }) => eq(notifications.userId, userId),
      orderBy: (notifications, { desc }) => desc(notifications.createdAt),
      limit: 250,
      with: {
        author: true,
        task: {
          with: {
            performer: true,
          },
        },
      },
    })
  }

  static async create(data: NotificationDraft) {
    const [notification] = await useDatabase().insert(notifications).values(data).returning()
    return notification
  }

  static async update(id: string, data: Partial<NotificationDraft>) {
    const [notification] = await useDatabase()
      .update(notifications)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(notifications.id, id))
      .returning()
    return notification
  }

  static async markAsViewed(id: string) {
    const [notification] = await useDatabase()
      .update(notifications)
      .set({
        viewedAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .where(eq(notifications.id, id))
      .returning()
    return notification
  }

  static async delete(id: string) {
    return useDatabase().delete(notifications).where(eq(notifications.id, id))
  }
}
