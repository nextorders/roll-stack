<template>
  <button
    class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer tg-text-subtitle"
    @click="(isMainPage && canScrollToTop && isThisRoute) ? handleScrollToTop() : handleRedirect(route.path)"
  >
    <div
      class="relative py-1 w-full rounded-2xl flex flex-row items-center justify-center"
      :class="[
        isThisRoute && 'tg-bg-button tg-text-button motion-translate-y-in',
      ]"
    >
      <UIcon
        v-if="isMainPage && canScrollToTop && isThisRoute"
        name="i-lucide-arrow-up"
        class="size-6 motion-preset-shake"
      />
      <UIcon
        v-else-if="isFlowInnerPage && canReturnToMain && route.name === 'flow'"
        name="i-lucide-undo-2"
        class="size-6 motion-preset-shake"
      />
      <UIcon
        v-else
        :name="route.icon"
        class="size-6 motion-preset-shake"
      />
    </div>
    <p
      class="text-xs font-medium"
      :class="[
        isThisRoute && 'tg-text',
      ]"
    >
      {{ route.title }}
    </p>
  </button>
</template>

<script setup lang="ts">
const { route } = defineProps<{ route: NavigationRoute }>()

const { vibrate } = useFeedback()
const { canScrollToTop, isMainPage, isFlowInnerPage, canReturnToMain } = useNavigation()
const router = useRouter()

const isThisRoute = computed(() => route.exact ? router.currentRoute.value.path === route.path : router.currentRoute.value.path.startsWith(route.path))

function handleScrollToTop() {
  vibrate()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleRedirect(path: string) {
  vibrate()
  router.push(path)
}
</script>
