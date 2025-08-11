import type { ActivityScheduleDraft } from '../types'
import { eq } from 'drizzle-orm'
import { useDatabase } from '../database'
import { activitySchedules } from '../tables'

export class Activity {
  static async findSchedule(id: string) {
    return useDatabase().query.activitySchedules.findFirst({
      where: (activity, { eq }) => eq(activity.id, id),
      with: {
        items: true,
      },
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

  static async updateSchedule(id: string, data: ActivityScheduleDraft) {
    const [schedule] = await useDatabase()
      .update(activitySchedules)
      .set(data)
      .where(eq(activitySchedules.id, id))
      .returning()
    return schedule
  }

  static async deleteSchedule(id: string) {
    return useDatabase().delete(activitySchedules).where(eq(activitySchedules.id, id))
  }
}
