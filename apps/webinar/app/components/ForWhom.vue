<template>
  <UPageSection
    id="for"
    ref="target"
    title="Для кого этот вебинар?"
    description="Этот вебинар идеально подойдет для вас, если вы:"
    orientation="horizontal"
    :reverse="true"
    :features="firstSectionItems"
  >
    <div
      class="w-full h-fit aspect-square min-h-56 text-muted bg-cover rounded-lg"
      :class="{ 'motion-preset-slide-right motion-preset-pop motion-duration-2000': isVisible }"
      style="background-image: url('/bg-whom.png');"
    />
  </UPageSection>
</template>

<script setup lang="ts">
const firstSectionItems = [
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
  {
    title: 'Хотите систематизировать имеющиеся знания о запуске бизнеса и получить чёткий пошаговый план действий',
    icon: 'i-lucide-notebook-pen',
  },
]

const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target, {
  rootMargin: '0px 0px -100px 0px',
})

const isVisible = ref(false)
watch(targetIsVisible, () => {
  if (!targetIsVisible.value) {
    return
  }

  isVisible.value = targetIsVisible.value
})
</script>
