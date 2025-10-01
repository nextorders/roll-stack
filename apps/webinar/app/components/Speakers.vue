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
    image: 'https://avatar.nextorders.ru/377188?emotion=8&gender=female&clothing=teal',
  },
  {
    name: 'Татьяна Панасевич',
    caption: 'Основатель сети суши-баров «Суши Love»',
    description: 'Ответит на все вопросы по работе с франшизой',
    image: 'https://avatar.nextorders.ru/797837?emotion=6&gender=female&clothing=violet',
  },
  {
    name: 'Анна Михалко',
    caption: 'Наставник партнеров и эксперт по открытию новых точек франшизы',
    description: 'Даст пошаговый план открытия, который используют все наши партнеры',
    image: 'https://avatar.nextorders.ru/887463?emotion=7&gender=female&clothing=pink',
  },
])
</script>
