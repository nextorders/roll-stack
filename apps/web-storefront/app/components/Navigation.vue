<template>
  <div class="flex flex-col gap-4 flex-1 overflow-y-auto py-2">
    <div class="px-0 flex flex-col gap-1">
      <UButton
        variant="link"
        color="secondary"
        size="md"
        class="text-secondary! px-2.5 py-0 text-lg font-semibold cursor-pointer"
        @click="modalCitySelector.open()"
      >
        {{ city?.name }}
      </UButton>
    </div>

    <div class="px-2.5 flex flex-col gap-1">
      <NuxtLink
        href="/"
        class="font-semibold text-xl/6 tracking-tight"
      >
        {{ channelStore?.name }}
      </NuxtLink>
      <div class="text-sm/4 text-muted">
        {{ channelStore?.description }}
      </div>
    </div>

    <UNavigationMenu
      v-if="checkoutStore.id"
      :items="deliveryMenuItems"
      orientation="vertical"
    />

    <UNavigationMenu
      :items="catalogItems"
      orientation="vertical"
    />
  </div>

  <div class="shrink-0 flex items-center gap-1.5 py-2 px-2">
    <ColorModeToggle />
  </div>
</template>

<script setup lang="ts">
import { ModalCitySelector, ModalDeliveryInfo } from '#components'

const { t } = useI18n()
const route = useRoute()

const menuStore = useMenuStore()
const channelStore = useChannelStore()
const checkoutStore = useCheckoutStore()

const { public: publicEnv } = useRuntimeConfig()
const cityStore = useCityStore()
const city = computed(() => cityStore.cities.find((c) => c.id === publicEnv.cityId))

const overlay = useOverlay()
const modalDeliveryInfo = overlay.create(ModalDeliveryInfo)
const modalCitySelector = overlay.create(ModalCitySelector)

const preparedCategories = computed(() => menuStore.menu?.categories.map((c) => ({
  label: c.name,
  to: `/catalog/${c.slug}`,
  active: route.path.startsWith(`/catalog/${c.slug}`),
  icon: c.icon?.length ? c.icon : 'i-lucide-bookmark',
})) ?? [])

const minAmountForDelivery = 850
const workingDay = {
  isActive: true,
  close: '23:00',
}

const title = computed(() => checkoutStore.deliveryMethod === 'delivery' ? t('storefront.cart.delivery') : t('storefront.cart.pickup'))
const todayUntil = computed(() => workingDay.isActive ? workingDay.close : undefined)

const deliveryMenuItems = computed(() => [
  {
    label: title.value,
    type: 'label' as const,
  },
  {
    label: `${t('storefront.cart.today-until')} ${todayUntil.value}`,
    icon: 'i-lucide-clock',
  },
  {
    label: `${t('storefront.cart.from')} ${minAmountForDelivery} ${channelStore.currencySign}`,
    icon: 'i-lucide-wallet',
    class: (checkoutStore.deliveryMethod === 'delivery' && minAmountForDelivery) ? undefined : 'hidden',
    onSelect: () => modalDeliveryInfo.open(),
  },
  {
    label: t('storefront.cart.conditions'),
    icon: 'i-lucide-info',
    onSelect: () => modalDeliveryInfo.open(),
  },
])

const catalogItems = computed(() => [{
  label: t('storefront.catalog'),
  type: 'label' as const,
}, ...preparedCategories.value])
</script>
