import type { WasabiVistaUserDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { wasabiVistaUsers } from '../tables'

export class Wasabi {
  static async findUser(id: string) {
    return useDatabase().query.wasabiVistaUsers.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }

  static async findUserByKey(key: string) {
    return useDatabase().query.wasabiVistaUsers.findFirst({
      where: (users, { eq }) => eq(users.accessKey, key),
    })
  }

  static async findUserByTelegramId(telegramId: string) {
    return useDatabase().query.wasabiVistaUsers.findFirst({
      where: (users, { eq }) => eq(users.telegramId, telegramId),
      with: {
        user: true,
      },
    })
  }

  static async findUserById(userId: string) {
    return useDatabase().query.wasabiVistaUsers.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
    })
  }

  static async createUser(data: WasabiVistaUserDraft) {
    const [user] = await useDatabase().insert(wasabiVistaUsers).values(data).returning()
    return user
  }

  static async updateUser(id: string, data: Partial<WasabiVistaUserDraft>) {
    const [user] = await useDatabase()
      .update(wasabiVistaUsers)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(wasabiVistaUsers.id, id))
      .returning()
    return user
  }

  static async deleteUser(id: string) {
    return useDatabase().delete(wasabiVistaUsers).where(eq(wasabiVistaUsers.id, id))
  }
}
