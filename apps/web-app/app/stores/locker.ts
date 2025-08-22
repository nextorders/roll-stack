import type { LockerItem, LockerItemDuplicate } from '@roll-stack/database'

export type LockerItemDuplicateWithData = LockerItemDuplicate & { item: LockerItem }

export const useLockerStore = defineStore('locker', () => {
  const duplicates = ref<LockerItemDuplicateWithData[]>([])

  async function update() {
    try {
      const data = await $fetch('/api/locker/duplicate/list')
      if (!data) {
        return
      }

      duplicates.value = data
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
    duplicates,

    update,
  }
})
