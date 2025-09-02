<template>
  <nav class="z-50 touch-pan-x fixed bottom-0 left-0 right-0 w-full h-25 tg-bg-bottom-bar border-t border-default rounded-t-lg motion-preset-slide-up">
    <div class="max-w-[28rem] mx-auto">
      <div class="mt-3 grid grid-cols-3">
        <NavigationButton
          v-for="route in mainRoutes"
          :key="route.path"
          :route="route"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { NavigationRoute } from '#shared/types/index'

const { t } = useI18n()

const mainRoutes = computed<NavigationRoute[]>(() => [
  {
    path: '/',
    name: 'home',
    title: t('app.home'),
    icon: 'i-lucide-layout-dashboard',
    exact: true,
  },
  {
    path: '/user',
    name: 'user',
    title: 'Кабинет',
    icon: 'i-lucide-user',
  },
  {
    path: '/secret1',
    name: 'navigation',
    title: 'Меню',
    icon: 'i-lucide-menu',
  },
])
</script>
