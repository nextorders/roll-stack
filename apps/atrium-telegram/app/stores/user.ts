import type { Task, User } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-vue'

type UserWithData = User & {
  focusedTask: Task | null
}

export const useUserStore = defineStore('user', () => {
  const id = ref<string | undefined>(undefined)
  const type = ref<User['type'] | undefined>(undefined)
  const name = ref<string | undefined>(undefined)
  const surname = ref<string | undefined>(undefined)
  const caption = ref<string | undefined>(undefined)
  const email = ref<string | null>(null)
  const phone = ref<string | null>(null)
  const avatarUrl = ref<string | null>(null)
  const focusedTaskId = ref<string | null>(null)

  const initDataRaw = useSignal(_initDataRaw)
  const initDataState = useSignal(_initDataState)

  const fullName = computed(() => {
    return `${name.value} ${surname.value}`
  })

  const staff = ref<UserWithData[]>([])
  const users = ref<UserWithData[]>([])

  async function update() {
    try {
      const data = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      id.value = data.id
      type.value = data.type
      name.value = data.name
      surname.value = data.surname
      caption.value = data.caption
      email.value = data.email
      phone.value = data.phone
      avatarUrl.value = data.avatarUrl
      focusedTaskId.value = data.focusedTaskId
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

  async function updateOnline() {
    try {
      if (!id.value) {
        return
      }

      await $fetch(`/api/user/id/${id.value}/online`, {
        method: 'POST',
      })
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

  function find(userId: string): UserWithData | undefined {
    return users.value.find((user) => user.id === userId)
  }

  return {
    id,
    name,
    surname,
    caption,
    email,
    avatarUrl,
    focusedTaskId,

    fullName,

    staff,
    users,

    initDataRaw,
    initDataState,

    update,
    updateOnline,
    find,
  }
})
