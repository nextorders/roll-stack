<template>
  <nav class="z-50 touch-pan-x fixed bottom-0 left-0 right-0 w-full h-25 tg-bg-bottom-bar border-t border-default rounded-t-lg motion-preset-slide-up">
    <div class="max-w-[28rem] mx-auto">
      <div class="mt-3 grid grid-cols-4">
        <button
          v-for="route in mainRoutes"
          :key="route.path"
          class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer tg-text-subtitle"
          @click="handleClick(route.path)"
        >
          <div
            class="relative py-1 w-full rounded-2xl flex flex-row items-center justify-center"
            :class="[
              router.currentRoute.value.path === route.path && 'tg-bg-button tg-text-button motion-translate-y-in',
            ]"
          >
            <UIcon :name="route.icon" class="size-6" />
          </div>
          <p
            class="text-xs font-medium"
            :class="[
              router.currentRoute.value.path === route.path && 'tg-text',
            ]"
          >
            {{ route.title }}
          </p>
        </button>
      </div>
    </div>
  </nav>
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
  },
  {
    path: '/epic',
    name: 'quests',
    title: 'Секрет',
    icon: 'i-lucide-lock',
  },
  {
    path: '/secret1',
    name: 'shop',
    title: 'Секрет',
    icon: 'i-lucide-lock',
  },
  {
    path: '/secret2',
    name: 'top',
    title: 'Секрет',
    icon: 'i-lucide-lock',
  },
])

function handleClick(path: string) {
  vibrate()
  router.push(path)
}
</script>
