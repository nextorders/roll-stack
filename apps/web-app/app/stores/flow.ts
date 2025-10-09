import type { FlowItem, FlowItemComment, FlowItemView } from '@roll-stack/database'

export type FlowItemWithData = FlowItem & {
  comments: FlowItemComment[]
  views: FlowItemView[]
}

export const useFlowStore = defineStore('flow', () => {
  const items = ref<FlowItemWithData[]>([])

  const nowViewedItemsCount = computed(() => items.value.filter((item) => !item.views.some((view) => view.userId === useUserStore().id)).length)

  async function update() {
    try {
      const data = await $fetch('/api/flow/list')
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

  async function addView(itemId: string) {
    try {
      await $fetch(`/api/flow/id/${itemId}/view`, {
        method: 'POST',
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
    items,

    nowViewedItemsCount,

    update,
    addView,
  }
})
