<template>
  <UPageSection
    id="faq"
    title="Ответы на главные вопросы"
    orientation="vertical"
  >
    <UAccordion
      :items="items"
      :ui="{
        label: 'text-xl',
        body: 'text-base',
      }"
      class="mx-auto max-w-xl"
    />
  </UPageSection>
</template>

<script lang="ts" setup>
const items = ref([
  {
    label: 'А если у меня нет опыта в общепите?',
    content: 'Именно для новичков и проводится этот вебинар. После его просмотра у вас появится план действий и начальные знания в общепите.',
  },
  {
    label: 'Я боюсь больших вложений. Есть ли варианты?',
    content: 'Доставку роллов и пиццы можно открыть с вложениями до 1 млн. рублей. На вебинаре подробнее рассмотрим финансовый калькулятор.',
  },
])
</script>
