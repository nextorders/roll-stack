import type { TaskDraft, TaskListDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { taskLists, tasks } from '../tables'

export class Task {
  static async find(id: string) {
    return useDatabase().query.tasks.findFirst({
      where: (tasks, { eq }) => eq(tasks.id, id),
    })
  }

  static async findAll() {
    return useDatabase().query.tasks.findMany({
      orderBy: (tasks, { desc }) => desc(tasks.updatedAt),
      limit: 1500,
    })
  }

  static async findList(id: string) {
    return useDatabase().query.taskLists.findFirst({
      where: (taskLists, { eq, and }) => and(eq(taskLists.id, id), eq(taskLists.isArchived, false)),
      with: {
        tasks: {
          where: (tasks, { or, isNull, gte }) =>
            or(
              isNull(tasks.completedAt),
              gte(tasks.completedAt, sql`now() - interval '12 hour'`),
            ),
          orderBy: (tasks, { desc }) => desc(tasks.updatedAt),
        },
        chat: {
          with: {
            members: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    })
  }

  static async lists() {
    return useDatabase().query.taskLists.findMany({
      where: (taskLists, { eq }) => eq(taskLists.isArchived, false),
      orderBy: (taskLists, { desc }) => desc(taskLists.updatedAt),
      with: {
        tasks: {
          where: (tasks, { or, isNull, gte }) =>
            or(
              isNull(tasks.completedAt),
              gte(tasks.completedAt, sql`now() - interval '12 hour'`),
            ),
          orderBy: (tasks, { desc }) => desc(tasks.updatedAt),
        },
        chat: {
          with: {
            members: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    })
  }

  static async listCompletedToday() {
    return useDatabase().query.tasks.findMany({
      where: (tasks, { gte }) => gte(tasks.completedAt, sql`now() - interval '12 hour'`),
      orderBy: (tasks, { desc }) => desc(tasks.updatedAt),
    })
  }

  static async listCompletedThisWeek() {
    return useDatabase().query.tasks.findMany({
      where: (tasks, { gte }) => gte(tasks.completedAt, sql`now() - interval '6 day'`),
      orderBy: (tasks, { desc }) => desc(tasks.updatedAt),
    })
  }

  static async autoCreatorsList() {
    return useDatabase().query.taskAutoCreators.findMany()
  }

  static async create(data: TaskDraft) {
    const [task] = await useDatabase().insert(tasks).values(data).returning()
    return task
  }

  static async createList(data: TaskListDraft) {
    const [list] = await useDatabase().insert(taskLists).values(data).returning()
    return list
  }

  static async update(id: string, data: Partial<TaskDraft>) {
    const [task] = await useDatabase()
      .update(tasks)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(tasks.id, id))
      .returning()
    return task
  }

  static async complete(id: string, data: Pick<TaskDraft, 'resolution' | 'report'>) {
    const [task] = await useDatabase()
      .update(tasks)
      .set({
        ...data,
        completedAt: sql`now()`,
        updatedAt: sql`now()`,
      })
      .where(eq(tasks.id, id))
      .returning()
    return task
  }

  static async updateList(id: string, data: Partial<TaskListDraft>) {
    const [list] = await useDatabase()
      .update(taskLists)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(taskLists.id, id))
      .returning()
    return list
  }

  static async delete(id: string) {
    return useDatabase().delete(tasks).where(eq(tasks.id, id))
  }

  static async deleteList(id: string) {
    return useDatabase().delete(taskLists).where(eq(taskLists.id, id))
  }
}
