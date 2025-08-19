import type { TelegramUserDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { telegramUsers } from '../tables'

export class Telegram {
  static async findBot(id: string) {
    return useDatabase().query.telegramBots.findFirst({
      where: (bots, { eq }) => eq(bots.id, id),
    })
  }

  static async findUser(id: string) {
    return useDatabase().query.telegramUsers.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }

  static async findUserByKey(key: string) {
    return useDatabase().query.telegramUsers.findFirst({
      where: (users, { eq }) => eq(users.accessKey, key),
    })
  }

  static async findUserByTelegramIdAndBotId(telegramId: string, botId: string) {
    return useDatabase().query.telegramUsers.findFirst({
      where: (users, { eq, and }) => and(
        eq(users.telegramId, telegramId),
        eq(users.botId, botId),
      ),
      with: {
        user: true,
      },
    })
  }

  static async findUserByIdAndBotId(userId: string, botId: string) {
    return useDatabase().query.telegramUsers.findFirst({
      where: (users, { eq, and }) => and(
        eq(users.userId, userId),
        eq(users.botId, botId),
      ),
      with: {
        user: true,
      },
    })
  }

  static async createUser(data: TelegramUserDraft) {
    const [user] = await useDatabase().insert(telegramUsers).values(data).returning()
    return user
  }

  static async updateUser(id: string, data: Partial<TelegramUserDraft>) {
    const [user] = await useDatabase()
      .update(telegramUsers)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(telegramUsers.id, id))
      .returning()
    return user
  }

  static async deleteUser(id: string) {
    return useDatabase().delete(telegramUsers).where(eq(telegramUsers.id, id))
  }
}
