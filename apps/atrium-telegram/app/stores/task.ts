import type { Chat, ChatMember, Task, TaskList, User } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

type ChatWithData = Chat & {
  members: (ChatMember & { user: User })[]
}

type TaskListWithData = TaskList & {
  tasks: Task[]
  chat: ChatWithData | null
}

export const useTaskStore = defineStore('task', () => {
  const lists = ref<TaskListWithData[]>([])
  const isTodayOnly = ref(false)
  const isInitialized = ref(false)

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/task/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      lists.value = data

      isInitialized.value = true
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

  async function setAsFocused(taskId: string) {
    try {
      await $fetch(`/api/task/id/${taskId}/focus`, {
        method: 'POST',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function setAsUnfocused(taskId: string) {
    try {
      await $fetch(`/api/task/id/${taskId}/focus`, {
        method: 'DELETE',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Reset on page change
  watch(
    () => useRoute().fullPath,
    () => {
      isTodayOnly.value = false
    },
  )

  return {
    lists,
    isTodayOnly,
    isInitialized,

    update,
    setAsFocused,
    setAsUnfocused,
  }
})
