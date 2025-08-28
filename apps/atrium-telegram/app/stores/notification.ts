import type { Notification, Task, User } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

type TaskWithPerformer = Task & {
  performer: User | null
}

export type NotificationWithEntities = Notification & {
  task: TaskWithPerformer | null
  author: User
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationWithEntities[]>([])

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/notification/my', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      notifications.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function markAsViewed(notificationId: string) {
    try {
      await $fetch(`/api/notification/id/${notificationId}/viewed`, {
        method: 'POST',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })

      await update()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    notifications,

    update,
    markAsViewed,
  }
})
