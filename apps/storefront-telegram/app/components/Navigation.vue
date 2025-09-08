<template>
  <div v-if="clientStore.id" class="z-50 touch-pan-x sticky inset-0 h-38">
    <div class="w-full h-14 px-4 py-0 flex flex-row gap-2 items-start">
      <CartButton v-if="isCartButtonShown" />

      <UButton
        variant="soft"
        color="neutral"
        size="xl"
        icon="i-lucide-logs"
        block
        :ui="{
          base: 'size-12 aspect-square',
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
import type { NavigationRoute } from '#shared/types/index'

const router = useRouter()
const { t } = useI18n()
const { isNavigationShown } = useCatalog()
const clientStore = useClientStore()

const isCartButtonShown = computed(() => router.currentRoute.value.path === '/')

const mainRoutes = computed<NavigationRoute[]>(() => [
  {
    path: '/',
    name: 'home',
    title: t('app.home'),
    icon: 'i-lucide-layout-dashboard',
    exact: true,
  },
  {
    path: '/client',
    name: 'client',
    title: 'Кабинет',
    icon: 'i-lucide-user',
  },
  {
    path: '/menu',
    name: 'menu',
    title: 'Меню',
    icon: 'i-lucide-menu',
  },
])
</script>
