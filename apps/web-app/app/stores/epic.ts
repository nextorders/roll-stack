import type { Epic, EpicComment, Notification } from '@roll-stack/database'

type EpicCommentWithData = EpicComment & {
  notifications: Notification[]
}

type EpicWithData = Epic & {
  comments: EpicCommentWithData[]
}

export const useEpicStore = defineStore('epic', () => {
  const epics = ref<EpicWithData[]>([])

  async function update() {
    try {
      const data = await $fetch('/api/epic/list')
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

  async function addComment(epicId: string, text: string) {
    try {
      await $fetch(`/api/epic/id/${epicId}/comment`, {
        method: 'POST',
        body: {
          text,
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

  async function removeComment(id: string) {
    try {
      await $fetch(`/api/epic/comment/id/${id}`, {
        method: 'DELETE',
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
    addComment,
    removeComment,
  }
})
