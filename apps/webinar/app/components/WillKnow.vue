<template>
  <UPageSection
    ref="target"
    title="Что вы узнаете на вебинаре?"
    description="За 1,5 часа вы получите готовый план действий"
    orientation="horizontal"
    :features="secondSectionItems"
    :ui="{
      container: 'lg:pt-0',
    }"
  >
    <div
      class="w-full h-fit aspect-square min-h-56 text-muted bg-cover rounded-lg"
      :class="{ 'motion-preset-slide-left': isVisible }"
      style="background-image: url('/bg-know.png');"
    />
  </UPageSection>
</template>

<script setup lang="ts">
const secondSectionItems = [
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

const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target)

const isVisible = ref(false)
watch(targetIsVisible, () => {
  if (!targetIsVisible.value) {
    return
  }

  isVisible.value = targetIsVisible.value
})
</script>
