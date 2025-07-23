import type { Chat, ChatMember, Task, TaskList, User } from '@roll-stack/database'

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

  async function update() {
    try {
      const data = await $fetch('/api/task/list')
      if (!data) {
        return
      }

      lists.value = data
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
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function setAsUnfocused(taskId: string) {
    try {
      await $fetch(`/api/task/id/${taskId}/focus`, {
        method: 'DELETE',
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

    update,
    setAsFocused,
    setAsUnfocused,
  }
})
