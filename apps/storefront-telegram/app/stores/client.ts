import { initDataRaw as _initDataRaw, initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-vue'

export const useClientStore = defineStore('client', () => {
  const id = ref<string | undefined>(undefined)
  const name = ref<string | undefined>(undefined)
  const surname = ref<string | undefined>(undefined)
  // const phone = ref<string | null>(null)
  const avatarUrl = ref<string | null>(null)

  const initDataRaw = useSignal(_initDataRaw)
  const initDataState = useSignal(_initDataState)

  const fullName = computed(() => {
    return `${name.value} ${surname.value}`
  })

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
      name.value = data.name
      surname.value = data.surname ?? ''
      // phone.value = data.phone
      avatarUrl.value = data.avatarUrl
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
        if (error.message.includes('404')) {
          // Not found
        }
      }
    }
  }

  return {
    id,
    name,
    surname,
    avatarUrl,

    fullName,

    initDataRaw,
    initDataState,

    update,
    updateOnline,
  }
})
