import type { EpicCommentDraft, EpicDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { epicComments, epics } from '../tables'

export class Epic {
  static async find(id: string) {
    return useDatabase().query.epics.findFirst({
      where: (epics, { eq }) => eq(epics.id, id),
      with: {
        comments: true,
      },
    })
  }

  static async findComment(id: string) {
    return useDatabase().query.epicComments.findFirst({
      where: (epicComments, { eq }) => eq(epicComments.id, id),
    })
  }

  static async list() {
    return useDatabase().query.epics.findMany({
      orderBy: (epics, { desc }) => desc(epics.createdAt),
      with: {
        comments: {
          orderBy: (comments, { asc }) => asc(comments.createdAt),
        },
      },
    })
  }

  static async create(data: EpicDraft) {
    const [epic] = await useDatabase().insert(epics).values(data).returning()
    return epic
  }

  static async createComment(data: EpicCommentDraft) {
    const [comment] = await useDatabase().insert(epicComments).values(data).returning()
    return comment
  }

  static async update(id: string, data: Partial<EpicDraft>) {
    const [epic] = await useDatabase()
      .update(epics)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(epics.id, id))
      .returning()
    return epic
  }

  static async delete(id: string) {
    return useDatabase().delete(epics).where(eq(epics.id, id))
  }

  static async deleteComment(id: string) {
    return useDatabase().delete(epicComments).where(eq(epicComments.id, id))
  }
}
