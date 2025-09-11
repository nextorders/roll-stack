<template>
  <div class="z-50 touch-pan-x sticky inset-0 h-24">
    <nav class="w-full h-24 tg-bg-bottom-bar border-t border-default rounded-t-lg motion-preset-slide-up">
      <div class="mt-3 max-w-[28rem] mx-auto grid grid-cols-3">
        <button
          v-for="route in mainRoutes"
          :key="route.path"
          class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer tg-text-subtitle"
          @click="handleClick(route.path)"
        >
          <div
            class="relative py-1 w-full rounded-2xl flex flex-row items-center justify-center"
            :class="[
              (route.exact ? router.currentRoute.value.path === route.path : router.currentRoute.value.path.startsWith(route.path)) && 'tg-bg-button tg-text-button motion-translate-y-in',
            ]"
          >
            <UIcon :name="route.icon" class="size-6" />
          </div>
          <p
            class="text-xs font-medium"
            :class="[
              (route.exact ? router.currentRoute.value.path === route.path : router.currentRoute.value.path.startsWith(route.path)) && 'tg-text',
            ]"
          >
            {{ route.title }}
          </p>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { vibrate } = useFeedback()
const router = useRouter()

const mainRoutes = computed(() => [
  {
    path: '/',
    name: 'home',
    title: t('app.home'),
    icon: 'i-lucide-layout-dashboard',
    exact: true,
  },
  {
    path: '/epic',
    name: 'quests',
    title: 'Эпики',
    icon: 'i-lucide-crown',
  },
  {
    path: '/secret1',
    name: 'shop',
    title: 'Секрет',
    icon: 'i-lucide-lock',
  },
])

function handleClick(path: string) {
  vibrate()
  router.push(path)
}
</script>
