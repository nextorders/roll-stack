<template>
  <button
    class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer tg-text-subtitle"
    @click="canScrollToTop ? handleScrollToTop() : handleRedirect(route.path)"
  >
    <div
      class="relative py-1 w-full rounded-2xl flex flex-row items-center justify-center"
      :class="[
        isThisRoute && 'tg-bg-button tg-text-button motion-translate-y-in',
      ]"
    >
      <UIcon
        v-if="canScrollToTop"
        name="i-lucide-arrow-up"
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
import type { NavigationRoute } from '#shared/types/index'

const { route } = defineProps<{ route: NavigationRoute }>()

const { vibrate } = useFeedback()
const router = useRouter()

const isThisRoute = computed(() => route.exact ? router.currentRoute.value.path === route.path : router.currentRoute.value.path.startsWith(route.path))

const { y } = useWindowScroll()
const isCatalogButton = computed(() => route.path === '/')
const canScrollToTop = computed(() => isCatalogButton.value && y.value > 500)

function handleScrollToTop() {
  vibrate()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleRedirect(path: string) {
  vibrate()
  router.push(path)
}
</script>
