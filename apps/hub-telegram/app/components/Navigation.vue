<template>
  <div class="z-50 touch-pan-x sticky inset-0 h-24">
    <nav
      v-if="isNavigationShown"
      class="w-full h-24 tg-bg-bottom-bar border-t border-default rounded-t-lg motion-preset-slide-up"
    >
      <div
        class="mt-3 max-w-[28rem] mx-auto grid"
        :class="[
          mainRoutes.length > 3 ? 'grid-cols-4' : 'grid-cols-3',
        ]"
      >
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
</script>
