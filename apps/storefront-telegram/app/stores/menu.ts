import type { Media, MediaItem, Menu, MenuCategory, Product, ProductVariant } from '@roll-stack/database'
import { initData, useSignal } from '@tma.js/sdk-vue'

type ProductWithCategory = Product & { category: MenuCategory }

export type MediaWithItems = Media & {
  items: MediaItem[]
}

type MenuWithData = Menu & {
  categories: (MenuCategory & {
    products: (Product & {
      variants: ProductVariant[]
      media: MediaWithItems | null
    })[]
  })[]
}

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<MenuWithData>()

  const products = computed(() => menu.value?.categories.flatMap((c) => c.products) || [])

  const initDataRaw = useSignal(initData.raw)

  async function update() {
    try {
      const data = await $fetch('/api/menu', {
        headers: {
          Authorization: `tma ${initDataRaw.value}`,
        },
      })
      if (!data) {
        return
      }

      menu.value = data
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

  function getProductsForSearch(): ProductWithCategory[] {
    const result: ProductWithCategory[] = []

    menu.value?.categories.forEach((category) => {
      category.products.forEach((product) => {
        result.push({ ...product, category })
      })
    })

    return result
  }

  return {
    menu,

    products,

    update,
    getProductsForSearch,
  }
})
