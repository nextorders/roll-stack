<template>
  <UPageSection
    orientation="vertical"
    :ui="{
      container: 'lg:pt-0',
    }"
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
      <div
        v-for="item in lastSectionItems"
        :key="item.title"
        class="px-6 py-12 w-full h-full flex flex-col gap-2.5 items-center text-center bg-muted rounded-lg motion-preset-slide-right"
      >
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          class="size-12 text-secondary"
        />
        <Logo v-else />

        <h4 class="text-2xl/7 font-bold">
          {{ item.title }}
        </h4>
      </div>
    </div>
  </UPageSection>
</template>

<script lang="ts" setup>
const lastSectionItems = [
  {
    title: 'Франшиза Суши Love',
  },
  {
    title: '12 лет на рынке',
    icon: 'i-lucide-calendar-heart',
  },
  {
    title: 'Более 100 успешных заведений по РФ и СНГ',
    icon: 'i-lucide-map-pinned',
  },
  {
    title: 'Средняя окупаемость по сети — 3 месяца',
    icon: 'i-lucide-banknote-arrow-up',
  },
]
</script>
