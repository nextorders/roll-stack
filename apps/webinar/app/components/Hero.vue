<template>
  <UPageHero
    orientation="horizontal"
    title="Готовый алгоритм действий для новичков"
    description="Бесплатный вебинар: «Как открыть ресторан, кофейню или суши-бар с нуля и избежать ошибок». Получите пошаговую инструкцию и ответы на все вопросы, от поиска помещения до первого заработка."
    headline="🤔 Мечтаете о своем заведении?"
    :links="links"
    :ui="{
      headline: 'py-2 px-4 w-fit bg-secondary text-white rounded-md motion-preset-seesaw',
      links: 'motion-preset-oscillate motion-duration-2000',
    }"
  >
    <HeroVideo />
  </UPageHero>
</template>

<script setup lang="ts">
const links = ref([
  {
    label: 'Записаться',
    to: 'https://t.me/SLFranchiseBot',
    target: '_blank',
    trailingIcon: 'i-lucide-arrow-right',
    ui: {
      base: 'px-6 text-xl',
    },
  },
])
</script>
