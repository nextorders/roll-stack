<template>
  <PageContainer>
    <div class="flex flex-col gap-2">
      <UButton
        v-for="item in items"
        :key="item.label"
        size="xl"
        color="neutral"
        variant="ghost"
        :label="item.label"
        :to="item.to"
        :icon="item.icon"
        :ui="{
          base: 'px-0 pt-0 text-2xl/6 font-bold',
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
    label: 'Реестр договоров',
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
