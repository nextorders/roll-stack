import type { Chat, ChatMember, Task, TaskList, User } from '@roll-stack/database'
import { getLocalTimeZone, isToday, parseDate } from '@internationalized/date'
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

  const userStore = useUserStore()

  const myLists = computed(() =>
    lists.value.filter(
      (taskList) => taskList.chat?.members.some((member) => member.userId === userStore.id),
    ).filter((taskList) => isTodayOnly.value ? taskList.tasks.filter((task) => !task.completedAt && task.date && isToday(parseDate(task.date), getLocalTimeZone())).length : true),
  )
  const myTodayTasks = computed(() => myLists.value.flatMap((taskList) => taskList.tasks.filter((task) => !task.completedAt && task.date && isToday(parseDate(task.date), getLocalTimeZone()))))

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

    myLists,
    myTodayTasks,

    update,
    setAsFocused,
    setAsUnfocused,
  }
})
