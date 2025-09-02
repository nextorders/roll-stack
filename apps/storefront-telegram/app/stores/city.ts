import type { City } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

export const useCityStore = defineStore('city', () => {
  const cities = ref<City[]>([])
  const selected = ref<City | undefined>(undefined)

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
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
    cities,
    selected,

    update,
  }
})
