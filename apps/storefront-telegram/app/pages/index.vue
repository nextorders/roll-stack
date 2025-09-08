<template>
  <PageContainer :back="false">
    <div class="flex flex-row gap-3.5 items-center">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl/6 font-bold tracking-tight">
          Суши Love
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
