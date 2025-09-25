<template>
  <div class="mt-10">
    <HeaderLogo />
  </div>

  <UPageHero
    orientation="horizontal"
    title="Мечтаете о своем заведении? Готовый алгоритм действий для новичков"
    description="Бесплатный вебинар: «Как открыть ресторан, кофейню или суши-бар с нуля и избежать ошибок». Получите пошаговую инструкцию и ответы на все вопросы, от поиска помещения до первого заработка."
    headline="Поторопись!"
    :links="links"
    :ui="{
      headline: 'py-2 px-4 w-fit bg-secondary text-white rounded-lg motion-preset-seesaw',
    }"
  >
    <video
      controls
      class="max-h-160 w-auto mx-auto rounded-xl"
    >
      <source src="https://storage.yandexcloud.net/sushi-love-test/telegram/files/BAACAgIAAxkBAAOFaMwda7U9ddiws5ZJ4oIbaeSlw0YAAvWDAAJt32BKU94XDWZ9cCg2BA.mp4" type="video/mp4">
      Ваш браузер не поддерживает видео
    </video>
  </UPageHero>

  <InfiniteTitlesDivider />

  <UPageSection
    title="Для кого этот вебинар?"
    description="Этот вебинар идеально подойдет для вас, если вы:"
    orientation="horizontal"
    :reverse="true"
    :features="firstSectionItems"
  >
    Тут фото?
  </UPageSection>

  <UPageSection
    title="Что вы узнаете на вебинаре?"
    description="За 1,5 часа вы получите готовый план действий"
    orientation="horizontal"
    :features="secondSectionItems"
  >
    Тут фото?
  </UPageSection>
</template>

<script setup lang="ts">
import type { PageFeatureProps } from '@nuxt/ui'

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

const firstSectionItems: PageFeatureProps[] = [
  {
    title: 'Мечтаете открыть свое заведение',
    icon: 'i-lucide-store',
  },
  {
    title: 'Ищете бизнес с быстрой окупаемостью',
    icon: 'i-lucide-piggy-bank',
  },
  {
    title: 'Не знаете, с чего начать и сколько денег нужно',
    icon: 'i-lucide-chart-pie',
  },
  {
    title: 'Боитесь не справиться с конкуренцией и привлечением гостей',
    icon: 'i-lucide-users',
  },
  {
    title: 'Не понимаете, как контролировать закупки, себестоимость и воровство на кухне',
    icon: 'i-lucide-hand-coins',
  },
]

const secondSectionItems: PageFeatureProps[] = [
  {
    title: 'Актуальность рынка',
    description: 'Данные исследований за 2025 год',
    icon: 'i-lucide-pie-chart',
  },
  {
    title: 'Выбор и проверка помещения',
    description: 'Как избежать ошибок и не взять «проблемное» место',
    icon: 'i-lucide-home',
  },
  {
    title: 'Юридические вопросы',
    description: 'Какие документы нужны и как их правильно оформить',
    icon: 'i-lucide-file-text',
  },
  {
    title: 'Ремонт и оборудование',
    description: 'Как не переплатить подрядчикам и где искать недорогое оборудование',
    icon: 'i-lucide-hammer',
  },
  {
    title: 'Подбор и обучение персонала',
    description: 'Где найти поваров и как их обучить стандартам',
    icon: 'i-lucide-users',
  },
  {
    title: 'Запуск рекламы',
    description: 'И привлечение первых гостей',
    icon: 'i-lucide-megaphone',
  },
  {
    title: 'Финансовый расчет',
    description: 'Разбор инвестиций, ежемесячных расходов и планируемой прибыли',
    icon: 'i-lucide-chart-line',
  },
]

useHead({
  title: 'Вебинар',
})
</script>
