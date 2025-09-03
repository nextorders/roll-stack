import { initDataRaw as _initDataRaw, initDataState as _initDataState, useSignal } from '@telegram-apps/sdk-vue'
import { parsePhoneNumberWithError } from 'libphonenumber-js'

export const useClientStore = defineStore('client', () => {
  const id = ref<string | undefined>(undefined)
  const name = ref<string | undefined>(undefined)
  const surname = ref<string | undefined>(undefined)
  const phone = ref<string | undefined>(undefined)
  const avatarUrl = ref<string | null>(null)

  const initDataRaw = useSignal(_initDataRaw)
  const initDataState = useSignal(_initDataState)

  const fullName = computed(() => {
    return `${name.value} ${surname.value}`
  })

  const formattedPhone = computed(() => {
    if (!phone.value) {
      return ''
    }

    const phoneNumber = parsePhoneNumberWithError(phone.value, 'RU')

    return phoneNumber?.format('INTERNATIONAL')
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
      phone.value = data.phone
      name.value = data.name
      surname.value = data.surname ?? ''
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
    phone,
    name,
    surname,
    avatarUrl,

    fullName,
    formattedPhone,

    initDataRaw,
    initDataState,

    update,
    updateOnline,
  }
})
