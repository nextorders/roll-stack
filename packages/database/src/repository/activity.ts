import type { ActivityScheduleDraft, ActivityScheduleItemDraft } from '../types'
import { eq, sql } from 'drizzle-orm'
import { useDatabase } from '../database'
import { activityScheduleItems, activitySchedules } from '../tables'

export class Activity {
  static async findSchedule(id: string) {
    return useDatabase().query.activitySchedules.findFirst({
      where: (activity, { eq }) => eq(activity.id, id),
      with: {
        items: true,
      },
    })
  }

  static async findScheduleItem(id: string) {
    return useDatabase().query.activityScheduleItems.findFirst({
      where: (activity, { eq }) => eq(activity.id, id),
    })
  }

  static async listSchedules() {
    return useDatabase().query.activitySchedules.findMany({
      with: {
        items: true,
      },
    })
  }

  static async createSchedule(data: ActivityScheduleDraft) {
    const [schedule] = await useDatabase().insert(activitySchedules).values(data).returning()
    return schedule
  }

  static async createScheduleItem(data: ActivityScheduleItemDraft) {
    const [item] = await useDatabase().insert(activityScheduleItems).values(data).returning()
    return item
  }

  static async updateSchedule(id: string, data: Partial<ActivityScheduleDraft>) {
    const [schedule] = await useDatabase()
      .update(activitySchedules)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(activitySchedules.id, id))
      .returning()
    return schedule
  }

  static async updateScheduleItem(id: string, data: Partial<ActivityScheduleItemDraft>) {
    const [item] = await useDatabase()
      .update(activityScheduleItems)
      .set({
        ...data,
        updatedAt: sql`now()`,
      })
      .where(eq(activityScheduleItems.id, id))
      .returning()
    return item
  }

  static async deleteSchedule(id: string) {
    return useDatabase().delete(activitySchedules).where(eq(activitySchedules.id, id))
  }

  static async deleteScheduleItem(id: string) {
    return useDatabase().delete(activityScheduleItems).where(eq(activityScheduleItems.id, id))
  }
}
