<template>
  <h2 class="text-2xl/5 font-semibold tracking-tight">
    {{ category?.name }}
  </h2>

  <div class="mb-10 grid grid-cols-2 gap-2 items-start justify-between">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product-id="product.id"
      :category-id="categoryId"
    />
  </div>
</template>

<script setup lang="ts">
const { categoryId } = defineProps<{
  categoryId: string
}>()

const menuStore = useMenuStore()
const category = menuStore.menu?.categories.find((c) => c.id === categoryId)
const products = category?.products.filter((p) => p.isAvailableForPurchase && p.variants.length)
</script>
