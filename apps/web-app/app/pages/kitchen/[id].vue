<template>
  <Header :title="`${kitchen?.name}`">
    <template #submenu>
      <UNavigationMenu
        :items="submenuItems"
        highlight
        class="flex-1 -ml-2.5"
      />
    </template>
  </Header>

  <NuxtPage />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('kitchen-id')

const kitchenStore = useKitchenStore()
const kitchen = computed(() => kitchenStore.kitchens.find((k) => k.id === params.id))

const submenuItems = computed(() => [
  {
    label: t('common.kitchen'),
    to: `/kitchen/${kitchen.value?.id}`,
    icon: 'i-lucide-store',
    exact: true,
  },
  {
    label: 'Рейтинг',
    to: `/kitchen/${kitchen.value?.id}/rating`,
    icon: 'i-lucide-star',
    badge: kitchen.value?.rating?.toFixed(1),
  },
  {
    label: 'Выручка',
    to: `/kitchen/${kitchen.value?.id}/finance`,
    icon: 'i-lucide-piggy-bank',
  },
])

useHead({
  title: t('common.kitchen'),
})
</script>
