<template>
  <UContainer class="mt-4 md:mt-6 flex flex-row gap-2 items-center justify-between">
    <UNavigationMenu
      :items="items"
      class="hidden md:flex"
      :ui="{
        item: 'mr-2',
        link: '!text-xl',
      }"
    />

    <SocialButtons />
  </UContainer>
</template>

<script setup lang="ts">
const items = ref([
  {
    label: 'Бесплатный вебинар',
    to: '#hero',
  },
  {
    label: 'Кому подойдет',
    to: '#for',
  },
  {
    label: 'Спикеры',
    to: '#speakers',
  },
  {
    label: 'Вопросы и ответы',
    to: '#faq',
  },
])
</script>
