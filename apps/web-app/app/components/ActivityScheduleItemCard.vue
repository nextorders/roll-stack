<template>
  <UCard>
    <div class="shrink-0 w-full flex flex-col gap-3.5">
      <UIcon name="i-lucide-calendar-range" class="size-14 text-primary" />

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ item.title }}
      </h3>

      <h4 class="flex flex-row gap-1.5 items-start md:text-base/5 font-semibold text-secondary">
        <UIcon name="i-lucide-clock" class="shrink-0 size-5" /> {{ item.period }}
      </h4>

      <p class="text-base/5 whitespace-pre-wrap">
        {{ item.description }}
      </p>

      <UAccordion
        :items="accordionItems"
        :ui="{
          trigger: 'text-base/5',
          body: 'text-base/5',
        }"
      />

      <div class="flex flex-row flex-wrap gap-1.5">
        <UBadge
          v-for="channel in item.communicationChannels"
          :key="channel"
          :label="getCommunicationChannelData(channel).label"
          :icon="getCommunicationChannelData(channel).icon"
          color="neutral"
          variant="outline"
          :ui="{
            leadingIcon: 'text-dimmed/75',
          }"
        />

        <UBadge
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          color="neutral"
          variant="subtle"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
import type { ActivityScheduleItem } from '@roll-stack/database'

type CommunicationChannel = ActivityScheduleItem['communicationChannels'][number]

const { item } = defineProps<{ item: ActivityScheduleItem }>()

const accordionItems = ref<AccordionItem[]>([
  {
    label: 'Условия',
    icon: 'i-lucide-trending-up-down',
    content: item.terms ?? '',
  },
])

const tags = [
  'Постоянная акция',
  'Опционально',
]

function getCommunicationChannelData(type: CommunicationChannel) {
  switch (type) {
    case 'vk':
      return {
        icon: 'simple-icons:vk',
        label: 'Вконтакте',
      }
    case 'telegram':
      return {
        icon: 'simple-icons:telegram',
        label: 'Telegram',
      }
    case 'website':
      return {
        icon: 'i-lucide-app-window',
        label: 'Вебсайт',
      }
    case 'uds_feed':
      return {
        icon: 'i-lucide-newspaper',
        label: 'UDS рассылка',
      }
    case 'table_tent':
      return {
        icon: 'i-lucide-layout-dashboard',
        label: 'Тейбл тент',
      }
    case 'mobile_app':
      return {
        icon: 'i-lucide-smartphone',
        label: 'Мобильное приложение',
      }
    case 'store_administrator':
      return {
        icon: 'i-lucide-circle-user-round',
        label: 'Администратор магазина',
      }
    case 'contextual_advertising':
      return {
        icon: 'i-lucide-megaphone',
        label: 'Контекстная реклама',
      }
    default:
      return {
        icon: 'i-lucide-info',
        label: type,
      }
  }
}
</script>
