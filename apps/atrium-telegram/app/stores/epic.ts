import type { Epic, EpicComment, Notification } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

type EpicCommentWithData = EpicComment & {
  notifications: Notification[]
}

export type EpicWithData = Epic & {
  comments: EpicCommentWithData[]
}

export const useEpicStore = defineStore('epic', () => {
  const epics = ref<EpicWithData[]>([])

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/epic/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      epics.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function removeComment(id: string) {
    try {
      await $fetch(`/api/epic/comment/id/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })

      await update()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No
        }
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    epics,

    update,
    removeComment,
  }
})
