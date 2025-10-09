<template>
  <PageContainer>
    <div class="flex flex-col gap-2.5 motion-preset-slide-left">
      <NuxtLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        @click="item.onClick"
      >
        <ActiveCard>
          <Section>
            <div class="text-2xl/6 font-bold flex flex-row gap-2 items-center">
              <UIcon :name="item.icon" />
              {{ item.label }}
            </div>
          </Section>
        </ActiveCard>
      </NuxtLink>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
const { vibrate } = useFeedback()

const items = ref([
  {
    label: 'Партнеры',
    to: '/partner',
    icon: 'i-lucide-users',
    onClick: () => vibrate(),
  },
  {
    label: 'Договоры',
    to: '/agreement',
    icon: 'i-lucide-list-checks',
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
