import type { Task, TelegramUser, User } from '@roll-stack/database'
import { initData, useSignal } from '@tma.js/sdk-vue'

type UserWithData = User & {
  focusedTask: Task | null
  telegramUsers: TelegramUser[]
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

  const initDataRaw = useSignal(initData.raw)
  const initDataState = useSignal(initData.state)

  const { idle } = useIdle(30 * 1000) // 30 sec

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

      // Updating all data
      await updateUsers()
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

  async function updateUsers() {
    try {
      const data = await $fetch('/api/user/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      staff.value = data.filter((user) => user.type === 'staff' && user.isActive && user.name && user.surname)
      users.value = data
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  async function updateOnline() {
    try {
      if (!id.value || idle.value) {
        return
      }

      await $fetch('/api/auth/online', {
        method: 'POST',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          // No session
        }
      }
    }
  }

  function find(userId: string): UserWithData | undefined {
    return users.value.find((user) => user.id === userId)
  }

  function getAvatarUrl(userId: string): string | undefined {
    const user = users.value.find((user) => user.id === userId)
    return user?.avatarUrl ?? undefined
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
    getAvatarUrl,
  }
})
