import type { UserDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { users } from '../tables'

export class User {
  static async find(id: string) {
    return useDatabase().query.users.findFirst({
      where: (users, { eq, and }) => and(
        eq(users.id, id),
        eq(users.isActive, true),
      ),
    })
  }

  static async findByEmail(email: string) {
    return useDatabase().query.users.findFirst({
      where: (users, { eq, and }) => and(
        eq(users.email, email),
        eq(users.isActive, true),
      ),
    })
  }

  static async findByPhone(phone: string) {
    return useDatabase().query.users.findFirst({
      where: (users, { eq, and }) => and(
        eq(users.phone, phone),
        eq(users.isActive, true),
      ),
    })
  }

  static async findStaff() {
    return useDatabase().query.users.findMany({
      where: (users, { eq, and }) => and(
        eq(users.type, 'staff'),
        eq(users.isActive, true),
      ),
      orderBy: (users, { asc }) => asc(users.name),
      with: {
        focusedTask: true,
      },
    })
  }

  static async findPartners() {
    return useDatabase().query.users.findMany({
      where: (users, { eq, and }) => and(
        eq(users.type, 'partner'),
        eq(users.isActive, true),
      ),
      orderBy: (users, { asc }) => asc(users.name),
      with: {
        focusedTask: true,
      },
    })
  }

  static async findBots() {
    return useDatabase().query.users.findMany({
      where: (users, { eq }) => eq(users.type, 'bot'),
    })
  }

  static async list() {
    return useDatabase().query.users.findMany({
      where: (users, { eq }) => eq(users.isActive, true),
      with: {
        focusedTask: true,
        telegramUsers: true,
      },
    })
  }

  static async create(data: UserDraft) {
    const [user] = await useDatabase().insert(users).values(data).returning()
    return user
  }

  static async update(id: string, data: Partial<UserDraft>) {
    const [user] = await useDatabase()
      .update(users)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(users.id, id))
      .returning()
    return user
  }

  static async updateOnline(id: string) {
    const [user] = await useDatabase()
      .update(users)
      .set({
        onlineAt: sql`now()`,
      })
      .where(eq(users.id, id))
      .returning()
    return user
  }

  static async delete(id: string) {
    return useDatabase().delete(users).where(eq(users.id, id))
  }
}
