<template>
  <Header />
  <Hero />
  <InfiniteTitlesDivider />

  <UPageSection
    id="for"
    title="Для кого этот вебинар?"
    description="Этот вебинар идеально подойдет для вас, если вы:"
    orientation="horizontal"
    :reverse="true"
    :features="firstSectionItems"
  >
    <div
      class="w-full h-fit aspect-3/2 min-h-56 text-muted bg-cover rounded-lg motion-preset-slide-right"
      style="background-image: url('/bg-1.jpg');"
    />
  </UPageSection>

  <UPageSection
    title="Что вы узнаете на вебинаре?"
    description="За 1,5 часа вы получите готовый план действий"
    orientation="horizontal"
    :features="secondSectionItems"
    :ui="{
      container: 'lg:pt-0',
    }"
  >
    <div
      class="w-full h-fit aspect-3/2 min-h-56 text-muted bg-cover rounded-lg motion-preset-slide-left"
      style="background-image: url('/bg-2.jpg');"
    />
  </UPageSection>

  <Countdown />
  <Speakers />
  <About />
  <Results />
  <Questions />

  <InfiniteTitlesDivider />

  <Footer />
</template>

<script setup lang="ts">
import type { PageFeatureProps } from '@nuxt/ui'

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
    title: 'Не знаете, с чего начать и сколько денег нужно для открытия',
    icon: 'i-lucide-chart-pie',
  },
  {
    title: 'Боитесь не справиться с конкуренцией и привлечением гостей',
    icon: 'i-lucide-users',
  },
  {
    title: 'Не понимаете, как контролировать закупки и себестоимость продукции',
    icon: 'i-lucide-hand-coins',
  },
]

const secondSectionItems: PageFeatureProps[] = [
  {
    title: 'Актуальность рынка общепита',
    description: 'Данные исследований за 2025 год',
    icon: 'i-lucide-pie-chart',
  },
  {
    title: 'Выбор помещения для старта',
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
    description: 'Как сделать ремонт недорого и не переплачивать за лишнее оборудование',
    icon: 'i-lucide-hammer',
  },
  {
    title: 'Подбор и обучение персонала',
    description: 'Как собрать и обучить команду, которая будет приносить вам деньги',
    icon: 'i-lucide-users',
  },
  {
    title: 'Запуск рекламы и привлечение первых гостей',
    description: 'В какую рекламу стоит вкладываться, а какую избегать',
    icon: 'i-lucide-megaphone',
  },
  {
    title: 'Финансовый расчет',
    description: 'Разбор инвестиций, ежемесячных расходов и планируемой прибыли на примере действующего суши-бара',
    icon: 'i-lucide-chart-line',
  },
]

useHead({
  title: 'Вебинар «Как открыть ресторан, кофейню или суши-бар с нуля и избежать ошибок» | Октябрь 2025',
})
</script>
