<template>
  <UPageHero
    id="hero"
    orientation="horizontal"
    title="Готовый алгоритм действий для новичков"
    description="Бесплатный вебинар: «Как открыть ресторан, кофейню или суши-бар с нуля и избежать ошибок». Получите пошаговую инструкцию и ответы на все вопросы, от поиска помещения до первого заработка."
    headline="🤔 Мечтаете о своем заведении?"
    :links="links"
    :ui="{
      container: 'lg:pt-24',
      headline: 'py-2 px-4 w-fit bg-[#f57e20] text-white rounded-md motion-preset-seesaw',
      links: 'motion-preset-oscillate motion-duration-2000',
    }"
  >
    <template #body>
      <div class="flex flex-col gap-2">
        <h3 class="flex flex-row gap-2 items-center text-xl font-bold">
          <UIcon name="i-lucide-calendar" class="size-8 text-secondary" /> 30 октября 2025
        </h3>
        <h3 class="flex flex-row gap-2 items-center text-xl font-bold">
          <UIcon name="i-lucide-clock" class="size-8 text-secondary" /> 12:00-13:30 (МСК)
        </h3>
      </div>
    </template>

    <HeroVideo />
  </UPageHero>
</template>

<script setup lang="ts">
const links = ref([
  {
    label: 'Зарегистрироваться через Telegram',
    to: 'https://t.me/SLFranchiseBot',
    target: '_blank',
    trailingIcon: 'simple-icons:telegram',
    color: 'secondary' as const,
    ui: {
      base: 'px-6 md:text-xl w-full md:w-fit',
    },
  },
])
</script>
