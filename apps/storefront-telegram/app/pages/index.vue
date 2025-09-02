<template>
  <PageContainer :back="false">
    <div class="flex flex-row gap-3.5 items-center">
      <div class="flex flex-col gap-1">
        <p>{{ cityStore.selected?.name }}</p>
        <p>{{ channelStore.name }}</p>
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
const cityStore = useCityStore()
const channelStore = useChannelStore()
const menuStore = useMenuStore()

useHead({
  title: 'Суши Love',
})
</script>
