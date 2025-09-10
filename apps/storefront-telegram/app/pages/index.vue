<template>
  <PageContainer :back="false">
    <div class="flex flex-col gap-4">
      <CatalogDeliveryTypeSelector />

      <div class="flex flex-col gap-1">
        <p class="text-muted">
          Суши Love, Калининград-1
        </p>
        <h1 class="text-xl/6 font-semibold">
          улица Фрунзе, 6В
        </h1>
      </div>
    </div>

    <CatalogStoriesSlider />
    <CatalogRecommendedSlider />
    <CatalogCategoriesSliderMenu />

    <CatalogCategoryBlock
      v-for="category in menuStore.menu?.categories"
      :key="category.id"
      :category-id="category.id"
    />
  </PageContainer>
</template>

<script setup lang="ts">
const menuStore = useMenuStore()

useHead({
  title: 'Суши Love',
})
</script>
