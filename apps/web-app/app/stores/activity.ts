import type { ActivitySchedule, ActivityScheduleItem } from '@roll-stack/database'

type ActivityScheduleWithData = ActivitySchedule & {
  items: ActivityScheduleItem[]
}

export const useActivityStore = defineStore('activity', () => {
  const schedules = ref<ActivityScheduleWithData[]>([])

  async function update() {
    try {
      const data = await $fetch('/api/activity/schedule/list')
      if (!data) {
        return
      }

      schedules.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    schedules,

    update,
  }
})
