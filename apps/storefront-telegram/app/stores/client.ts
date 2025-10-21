import type { City, ClientLevel } from '@roll-stack/database'
import { initData, useSignal } from '@tma.js/sdk-vue'
import { parsePhoneNumberWithError } from 'libphonenumber-js'

export const useClientStore = defineStore('client', () => {
  const id = ref<string | undefined>(undefined)
  const name = ref<string | undefined>(undefined)
  const surname = ref<string | undefined>(undefined)
  const phone = ref<string | undefined>(undefined)
  const avatarUrl = ref<string | null>(null)
  const points = ref(0)
  const numberOfOrders = ref(0)
  const totalOfOrders = ref(0)
  const selectedCityId = ref<string | null>(null)

  const levelId = ref<string | null>(null)
  const levels = ref<ClientLevel[]>([])

  const cities = ref<City[]>([])
  const isCitySelectorOpened = computed(() => !selectedCityId.value)
  const selectedCity = computed<City | undefined>(() => cities.value.find((c) => c.id === selectedCityId.value))

  const bonusProgramParticipantFrom = ref<string | null>(null)
  const isBonusProgramParticipant = computed(() => !!bonusProgramParticipantFrom.value)

  const initDataRaw = useSignal(initData.raw)
  const initDataState = useSignal(initData.state)

  const fullName = computed<string>(() => {
    return `${name.value} ${surname.value}`
  })

  const level = computed<ClientLevel | undefined>(() => levels.value.find((level) => level.id === levelId.value))
  const nextLevel = computed<ClientLevel | undefined>(() => {
    const levelNow = levels.value.find((level) => level.id === levelId.value)
    if (!levelNow?.level) {
      return
    }

    return levels.value.find((l) => l.level === levelNow.level + 1)
  })
  const nextLevelAmount = computed<number | undefined>(() => {
    if (!nextLevel.value?.amountToUnlock) {
      return
    }

    return nextLevel.value.amountToUnlock - totalOfOrders.value
  })
  const nextLevelProgressPercent = computed<number>(() => {
    if (!nextLevel.value?.amountToUnlock) {
      return 0
    }

    return (totalOfOrders.value / nextLevel.value.amountToUnlock) * 100
  })

  const formattedPhone = computed<string>(() => {
    if (!phone.value) {
      return ''
    }

    return parsePhoneNumberWithError(phone.value, 'RU').format('INTERNATIONAL')
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
      points.value = data.points
      numberOfOrders.value = data.numberOfOrders
      totalOfOrders.value = data.totalOfOrders
      levelId.value = data.levelId
      bonusProgramParticipantFrom.value = data.bonusProgramParticipantFrom
      selectedCityId.value = data.selectedCityId
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

  async function updateLevels() {
    try {
      const data = await $fetch('/api/client/level/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      levels.value = data
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

  async function updateCity(id: string | null) {
    try {
      await $fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
        body: {
          selectedCityId: id,
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

  async function updateCities() {
    try {
      const data = await $fetch('/api/city/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      cities.value = data
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
    id,
    phone,
    name,
    surname,
    avatarUrl,
    points,
    numberOfOrders,
    totalOfOrders,
    selectedCityId,

    level,
    nextLevel,
    nextLevelAmount,
    nextLevelProgressPercent,
    levels,

    cities,
    selectedCity,
    isCitySelectorOpened,

    bonusProgramParticipantFrom,
    isBonusProgramParticipant,

    fullName,
    formattedPhone,

    initDataRaw,
    initDataState,

    update,
    updateOnline,
    updateLevels,
    updateCities,
    updateCity,
  }
})
