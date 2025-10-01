<template>
  <UPageSection
    title="Результаты после вебинара"
    orientation="vertical"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
      <div
        v-for="item in lastSectionItems"
        :key="item.title"
        class="px-6 py-6 w-full h-full flex flex-col gap-2.5 items-center text-center bg-muted rounded-lg motion-preset-slide-right"
      >
        <UIcon
          v-if="item.icon"
          :name="item.icon"
          class="size-12 text-secondary"
        />
        <h4 class="text-2xl/7 font-bold">
          {{ item.title }}
        </h4>
        <p class="text-base/5">
          {{ item.description }}
        </p>
      </div>
    </div>
  </UPageSection>
</template>

<script lang="ts" setup>
const lastSectionItems = [
  {
    title: 'Поймете',
    description: 'Из чего складывается прибыль и как ее считать',
    icon: 'i-lucide-chart-spline',
  },
  {
    title: 'Узнаете',
    description: 'Как правильно подобрать помещение',
    icon: 'i-lucide-store',
  },
  {
    title: 'Получите',
    description: 'Пошаговую инструкцию по открытию своего заведения',
    icon: 'i-lucide-book-marked',
  },
]
</script>
