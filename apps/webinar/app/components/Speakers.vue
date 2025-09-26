<template>
  <UPageSection
    title="Спикеры и участники"
    headline="Наши специалисты"
    orientation="vertical"
    :ui="{
      title: 'text-center',
      headline: 'py-2 px-4 mx-auto w-fit bg-secondary text-white rounded-md motion-preset-stretch-sm',
    }"
  >
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
    image: '/sushi-main-logo.png',
  },
  {
    name: 'Татьяна Панасевич',
    caption: 'Основатель сети суши-баров «Суши Love»',
    image: '/sushi-main-logo.png',
  },
  {
    name: 'Анна Михалко',
    caption: 'Наставник партнеров и эксперт по открытию новых точек франшизы',
    image: '/sushi-main-logo.png',
  },
])
</script>
