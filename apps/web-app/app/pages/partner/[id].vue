<template>
  <Header :title="partner?.legalEntity?.name ?? t('common.partner')">
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
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))

const submenuItems = computed(() => [
  {
    label: t('common.partner'),
    to: `/partner/${partner.value?.id}`,
    icon: 'i-lucide-handshake',
    exact: true,
  },
  {
    label: t('app.menu.kitchens'),
    to: `/partner/${partner.value?.id}/kitchens`,
    icon: 'i-lucide-map-pinned',
    badge: partner.value?.kitchens.length,
  },
  {
    label: t('app.menu.agreements'),
    to: `/partner/${partner.value?.id}/agreement`,
    icon: 'i-lucide-scroll-text',
    badge: partner.value?.legalEntity?.agreements.length,
  },
  {
    label: t('app.partner-legal-entity.title'),
    to: `/partner/${partner.value?.id}/legal`,
    icon: 'i-lucide-scale',
  },
  {
    label: t('app.menu.staff'),
    to: `/partner/${partner.value?.id}/staff`,
    icon: 'i-lucide-contact-round',
    badge: partner.value?.users.length,
  },
])

useHead({
  title: t('common.partner'),
})
</script>
