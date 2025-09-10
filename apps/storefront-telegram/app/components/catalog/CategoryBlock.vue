<template>
  <div
    ref="target"
    class="flex flex-col gap-3 mb-10"
  >
    <h2 :id="category?.slug" class="scroll-mt-36 text-2xl/5 font-bold tracking-tight">
      {{ category?.name }}
    </h2>

    <div class="grid grid-cols-2 gap-2 items-start justify-between">
      <CatalogProductCard
        v-for="product in products"
        :key="product.id"
        :product-id="product.id"
        :category-id="categoryId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { categoryId } = defineProps<{
  categoryId: string
}>()

const { visibleCategory, observerOptions } = useCatalog()

const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target, observerOptions)

watch(targetIsVisible, (isVisible) => {
  if (isVisible && category?.slug) {
    visibleCategory.value = category.slug
  }
})

const menuStore = useMenuStore()
const category = menuStore.menu?.categories.find((c) => c.id === categoryId)
const products = category?.products.filter((p) => p.isAvailableForPurchase && p.variants.length)
</script>
