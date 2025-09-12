import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-vue'

export const useFlowStore = defineStore('flow', () => {
  const items = ref<FlowItemWithData[]>([])

  const initDataRaw = useSignal(_initDataRaw)

  async function update() {
    try {
      const data = await $fetch('/api/flow/list', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      items.value = data
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
    items,

    update,
  }
})
