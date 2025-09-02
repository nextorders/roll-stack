import type { Kitchen, PaymentMethod } from '@roll-stack/database'
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

type KitchenWithData = Kitchen & {
  paymentMethods: PaymentMethod[]
}

export const useChannelStore = defineStore('channel', () => {
  const id = ref<string | undefined>()
  const name = ref<string | undefined>()
  const description = ref<string | null>()
  const currencySign = ref('₽')
  const kitchens = ref<KitchenWithData[]>([])

  const selectedKitchenId = ref<string | undefined>()
  const selectedKitchen = computed(() => kitchens.value.find((kitchen) => kitchen.id === selectedKitchenId.value))

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/channel', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      id.value = data.id
      name.value = data.name
      description.value = data.description
      kitchens.value = data.kitchens ?? []
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
    name,
    description,
    currencySign,
    kitchens,

    selectedKitchenId,
    selectedKitchen,

    update,
  }
})
