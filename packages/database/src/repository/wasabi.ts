import type { WasabiUserDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { wasabiUsers } from '../tables'

export class Wasabi {
  static async findUser(id: string) {
    return useDatabase().query.wasabiUsers.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }

  static async findUserByKey(key: string) {
    return useDatabase().query.wasabiUsers.findFirst({
      where: (users, { eq }) => eq(users.accessKey, key),
    })
  }

  static async findUserByTelegramId(telegramId: string) {
    return useDatabase().query.wasabiUsers.findFirst({
      where: (users, { eq }) => eq(users.telegramId, telegramId),
      with: {
        user: true,
      },
    })
  }

  static async findUserById(userId: string) {
    return useDatabase().query.wasabiUsers.findFirst({
      where: (users, { eq }) => eq(users.userId, userId),
    })
  }

  static async createUser(data: WasabiUserDraft) {
    const [user] = await useDatabase().insert(wasabiUsers).values(data).returning()
    return user
  }

  static async updateUser(id: string, data: Partial<WasabiUserDraft>) {
    const [user] = await useDatabase()
      .update(wasabiUsers)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(wasabiUsers.id, id))
      .returning()
    return user
  }

  static async deleteUser(id: string) {
    return useDatabase().delete(wasabiUsers).where(eq(wasabiUsers.id, id))
  }
}
