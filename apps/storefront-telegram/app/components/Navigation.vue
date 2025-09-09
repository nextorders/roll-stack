<template>
  <div v-if="clientStore.id" class="z-50 touch-pan-x sticky inset-0 h-40">
    <div class="w-full h-16 px-4 py-0 flex flex-row flex-nowrap gap-0 items-start transition-all duration-200 ease-in-out">
      <CatalogCartButton />
      <CatalogAverageProgressButton />
      <CatalogCategoriesButton />
    </div>

    <nav
      v-if="isNavigationShown"
      class="w-full h-24 tg-bg-bottom-bar border-t border-default rounded-t-lg motion-preset-slide-up"
    >
      <div class="mt-3 max-w-[28rem] mx-auto grid grid-cols-3">
        <NavigationButton
          v-for="route in mainRoutes"
          :key="route.path"
          :route="route"
        />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { isNavigationShown, mainRoutes } = useNavigation()

const clientStore = useClientStore()
</script>
