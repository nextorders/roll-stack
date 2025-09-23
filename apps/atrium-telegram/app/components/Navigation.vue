<template>
  <div class="z-50 touch-pan-x sticky inset-0 h-24">
    <!-- <div class="w-full h-14 px-4 py-0 flex flex-row flex-nowrap gap-0 items-start justify-center transition-all duration-200 ease-in-out">
      <UButton
        v-if="isMainPage"
        variant="solid"
        color="secondary"
        size="xl"
        class="z-60 absolute top-8 transition-all duration-200 ease-in-out motion-preset-slide-up motion-duration-1000"
        icon="i-lucide-plus"
        :ui="{
          base: 'size-12 font-bold rounded-full',
          leadingIcon: 'size-6 mx-auto',
        }"
      />
    </div> -->

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
