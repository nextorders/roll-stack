<template>
  <div v-if="clientStore.id" class="z-50 touch-pan-x sticky inset-0 h-40">
    <div class="w-full h-16 px-4 py-0 flex flex-row gap-2 items-start">
      <CartButton v-if="isCartButtonShown" />

      <UButton
        v-if="isCategoriesButtonShown"
        variant="outline"
        color="neutral"
        size="xl"
        icon="i-lucide-logs"
        block
        :ui="{
          base: 'size-14 aspect-square motion-preset-slide-left motion-duration-500',
        }"
      />
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
const {
  isNavigationShown,
  isCartButtonShown,
  isCategoriesButtonShown,
  mainRoutes,
} = useNavigation()

const clientStore = useClientStore()
</script>
