<template>
  <UPageSection
    id="speakers"
    title="Спикеры и участники"
    headline="Наши специалисты"
    orientation="vertical"
    :ui="{
      title: 'text-center',
      headline: 'py-2 px-4 mx-auto w-fit bg-secondary text-white rounded-md motion-preset-stretch-sm',
    }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      <SpeakerCard
        v-for="speaker in speakers"
        :key="speaker.name"
        :speaker="speaker"
      />
    </div>
  </UPageSection>
</template>

<script setup lang="ts">
const speakers = ref([
  {
    name: 'Лидия Трошина',
    caption: 'Директор по маркетингу франшизы «Суши Love»',
    description: 'Покажет стратегии по привлечению гостей работающие в 2025 году',
    image: '/speaker-1.jpg',
  },
  {
    name: 'Татьяна Панасевич',
    caption: 'Основатель сети суши-баров «Суши Love»',
    description: 'Открыла более 100 заведений, ответит на все ваши вопросы',
    image: '/speaker-2.jpg',
  },
  {
    name: 'Анна Михалко',
    caption: 'Наставник партнеров и эксперт по открытию новых точек франшизы',
    description: 'Даст пошаговый план открытия, который используют все наши партнеры',
    image: '/speaker-3.jpg',
  },
])
</script>
