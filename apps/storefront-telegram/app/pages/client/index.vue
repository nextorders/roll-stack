<template>
  <PageContainer>
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl/5 font-bold tracking-tight">
        {{ clientStore.fullName }}
      </h1>
      <p class="text-muted text-base/5 font-medium">
        {{ clientStore.formattedPhone }}
      </p>
    </div>

    <ClientPointsCard />

    <UButtonGroup orientation="vertical" size="xl">
      <UButton
        v-for="item in items"
        :key="item.label"
        color="neutral"
        variant="ghost"
        :label="item.label"
        :icon="item.icon"
        :to="item.to"
        @click="item.onClick"
      />
    </UButtonGroup>
  </PageContainer>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()
const clientStore = useClientStore()

const items = ref([
  {
    label: 'Мои заказы',
    icon: 'i-lucide-shopping-basket',
    to: '/client/orders',
    onClick: () => vibrate(),
  },
  {
    label: 'Мои адреса',
    icon: 'i-lucide-map-pin-house',
    onClick: () => vibrate(),
  },
  {
    label: 'Мои данные',
    icon: 'i-lucide-user',
    onClick: () => vibrate(),
  },
  {
    label: clientStore.selectedCity ? clientStore.selectedCity.name : 'Выбрать город',
    icon: 'i-lucide-locate-fixed',
    onClick: () => {
      vibrate('success')
      clientStore.updateCity(null)
    },
  },
])
</script>
