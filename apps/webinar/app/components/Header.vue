<template>
  <UContainer class="mt-4 md:mt-6 flex flex-row gap-2 items-center justify-between">
    <UNavigationMenu
      :items="items"
      variant="link"
      class="hidden md:flex"
      :ui="{
        item: 'mr-3',
        link: 'text-xl! text-primary hover:text-secondary pl-0.5',
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
