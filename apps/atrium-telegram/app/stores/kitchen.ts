import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

type TodayData = {
  hoursWorkedForNow: number
  ordersForNow: number
}

export const useKitchenStore = defineStore('kitchen', () => {
  const kitchens = ref<KitchenWithData[]>([])
  const todayData = ref<TodayData | undefined>()

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/kitchen/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      kitchens.value = data

      await updateData()
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

  async function updateData() {
    try {
      const data = await $fetch('/api/kitchen/data', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      todayData.value = data
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
    kitchens,
    todayData,

    update,
  }
})
