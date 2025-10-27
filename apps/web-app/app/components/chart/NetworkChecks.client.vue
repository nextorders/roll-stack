<template>
  <UCard ref="cardRef" :ui="{ root: 'overflow-visible', body: 'px-0! pt-0! pb-3!' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          {{ formatTotalLabel('Средний чек', data.length) }}
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          {{ formatNumber(total) }}
        </p>
      </div>
    </template>

    <VisXYContainer
      :data="data"
      :padding="{ top: 40 }"
      :width="width"
      class="h-72"
    >
      <VisLine
        :x="x"
        :y="y"
        :color="color"
      />
      <VisArea
        :x="x"
        :y="yArea"
        color="var(--ui-info)"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
        :tick-format="xTicks"
      />

      <VisCrosshair
        color="var(--ui-info)"
        :template="formatTemplate"
      />

      <VisTooltip />
    </VisXYContainer>
  </UCard>
</template>

<script setup lang="ts">
import type { Period, Range } from '#shared/types'
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue'
import { addDays, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, format } from 'date-fns'
import { ru } from 'date-fns/locale'

type DataRecord = {
  start: Date
  end: Date
  checks: number
  averageCheck: number
}

const { period, range, values } = defineProps<{
  period: Period
  range: Range
  values: { date: string, checks: number, averageCheck: number }[]
}>()

const cardRef = useTemplateRef<HTMLElement | null>('cardRef')

const { width } = useElementSize(cardRef)

const data = ref<DataRecord[]>([])

watch([() => period, () => range, () => values], () => {
  const dates = ({
    daily: eachDayOfInterval,
    weekly: () => eachWeekOfInterval(range, { weekStartsOn: 1 }),
    monthly: eachMonthOfInterval,
  } as Record<Period, typeof eachDayOfInterval>)[period](range)

  if (period === 'daily') {
    data.value = dates.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const value = values.find((d) => d.date.startsWith(dateStr))

      return {
        start: date,
        end: date,
        checks: value?.checks ?? 0,
        averageCheck: value?.averageCheck ?? 0,
      }
    })
  }

  if (period === 'weekly') {
    const points = []

    for (const date of dates) {
      const dateTo = addDays(date, 6)
      const allDates = eachDayOfInterval({
        start: date,
        end: dateTo,
      })

      let daysWithValues = 0

      let checks = 0
      let averageCheck = 0

      for (const d of allDates) {
        // All in one point
        const dateStr = format(d, 'yyyy-MM-dd')
        const value = values.find((d) => d.date.startsWith(dateStr))

        checks += value?.checks ?? 0

        if (value?.averageCheck) {
          averageCheck += value.averageCheck
          daysWithValues++
        }
      }

      points.push({
        start: date,
        end: dateTo,
        checks,
        averageCheck: daysWithValues > 0 ? averageCheck / daysWithValues : 0,
      })
    }

    data.value = points
  }
}, { immediate: true })

const x = (_: DataRecord, i: number) => i
const y = (d: DataRecord) => d.averageCheck
const yArea = (d: DataRecord) => d.averageCheck

const color = () => 'var(--ui-info)'

const total = computed(() => {
  const totalRevenue = data.value.reduce((acc, d) => acc + (d.averageCheck * d.checks), 0)
  const totalChecks = data.value.reduce((acc, d) => acc + d.checks, 0)
  return totalChecks > 0 ? Math.floor(totalRevenue / totalChecks) : 0
})

function formatDate(date: Date): string {
  return ({
    daily: format(date, 'd MMMM', { locale: ru }),
    weekly: format(date, 'd MMMM', { locale: ru }),
    monthly: format(date, 'MMMM yyy', { locale: ru }),
  })[period]
}

function formatTotalLabel(label: string, value: number): string {
  return ({
    daily: `${label} за ${value} ${pluralizationRu(value, ['день', 'дня', 'дней'])}`,
    weekly: `${label} за ${value} ${pluralizationRu(value, ['неделю', 'недели', 'недель'])}`,
    monthly: `${label} за ${value} ${pluralizationRu(value, ['месяц', 'месяца', 'месяцев'])}`,
  })[period]
}

function xTicks(i: number) {
  if (i === 0 || i === data.value.length - 1 || !data.value[i]) {
    return ''
  }

  return formatDate(data.value[i].start)
}

function formatTemplate(d: DataRecord) {
  const title = ({
    daily: `${formatDate(d.start)}, ${format(d.start, 'eeee', { locale: ru })}`,
    weekly: `${formatDate(d.start)} - ${formatDate(d.end)}`,
    monthly: `${formatDate(d.start)} - ${formatDate(d.end)}`,
  })[period]

  return `<strong>${title}</strong><br> ${d.checks} ${pluralizationRu(d.checks, ['чек', 'чека', 'чеков'])}, средний ${formatNumber(d.averageCheck)}`
}
</script>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-info);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-dimmed);

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
