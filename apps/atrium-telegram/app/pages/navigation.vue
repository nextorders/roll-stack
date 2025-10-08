<template>
  <PageContainer>
    <div class="flex flex-col gap-2.5">
      <UButton
        v-for="item in items"
        :key="item.label"
        size="xl"
        color="secondary"
        variant="soft"
        :label="item.label"
        :to="item.to"
        :icon="item.icon"
        :ui="{
          base: 'text-2xl/6 font-bold',
        }"
        @click="item.onClick"
      />
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
const { vibrate } = useFeedback()

const items = ref([
  {
    label: 'Договоры',
    to: '/agreement',
    icon: 'i-lucide-list-checks',
    onClick: () => vibrate(),
  },
  {
    label: 'Партнеры',
    to: '/partner',
    icon: 'i-lucide-users',
    onClick: () => vibrate(),
  },
  {
    label: 'Кухни',
    to: '/kitchen',
    icon: 'i-lucide-store',
    onClick: () => vibrate(),
  },
])
</script>
