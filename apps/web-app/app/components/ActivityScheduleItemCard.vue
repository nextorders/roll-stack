<template>
  <UCard>
    <div class="shrink-0 w-full flex flex-col gap-3 group/list">
      <div class="flex flex-row gap-1.5 justify-between">
        <UIcon
          name="i-lucide-calendar-range"
          class="size-14 text-primary"
        />

        <UTooltip :text="`Редактировать активность «${item?.title}»`">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            class="size-10 justify-center opacity-0 group-hover/list:opacity-100"
            @click="modalUpdateActivityScheduleItem.open({ scheduleId: item.activityScheduleId, itemId: item.id })"
          />
        </UTooltip>
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ item.title }}
      </h3>

      <h4 class="flex flex-row gap-1.5 items-start md:text-base/5 font-semibold text-secondary">
        <UIcon name="i-lucide-clock" class="shrink-0 size-5" /> {{ item.period }}
      </h4>

      <p class="text-sm/4 whitespace-pre-wrap">
        {{ item.description }}
      </p>

      <UAccordion
        :items="accordionItems"
        :ui="{
          item: 'border-default/50',
          trigger: 'text-base/5',
          body: 'text-sm/4 whitespace-pre-wrap',
        }"
      />

      <div class="flex flex-row flex-wrap gap-1.5 opacity-25 group-hover/list:opacity-100 duration-200">
        <UBadge
          v-for="channel in item.communicationChannels"
          :key="channel"
          :label="getCommunicationChannelData(channel).label"
          :icon="getCommunicationChannelData(channel).icon"
          size="lg"
          color="neutral"
          variant="outline"
          :ui="{
            leadingIcon: 'text-dimmed/75',
          }"
        />

        <UBadge
          v-for="tag in item.tags"
          :key="tag"
          :label="getTagData(tag)"
          size="lg"
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
import { ModalUpdateActivityScheduleItem } from '#components'

type CommunicationChannel = ActivityScheduleItem['communicationChannels'][number]
type Tag = ActivityScheduleItem['tags'][number]

const { item } = defineProps<{ item: ActivityScheduleItem }>()

const { t } = useI18n()

const overlay = useOverlay()
const modalUpdateActivityScheduleItem = overlay.create(ModalUpdateActivityScheduleItem)

const accordionItems = ref<AccordionItem[]>([
  {
    label: 'Цели и задачи',
    icon: 'i-lucide-goal',
    content: item.goal ?? '',
  },
  {
    label: 'Условия',
    icon: 'i-lucide-trending-up-down',
    content: item.terms ?? '',
  },
])

function getCommunicationChannelData(type: CommunicationChannel) {
  switch (type) {
    case 'vk':
      return {
        icon: 'simple-icons:vk',
        label: t('common.social.vk'),
      }
    case 'telegram':
      return {
        icon: 'simple-icons:telegram',
        label: t('common.social.telegram'),
      }
    case 'website':
      return {
        icon: 'i-lucide-app-window',
        label: t('common.website'),
      }
    case 'uds':
      return {
        icon: 'i-lucide-newspaper',
        label: 'UDS',
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
    case 'calendar':
      return {
        icon: 'i-lucide-calendar',
        label: 'Календарь скидок',
      }
    default:
      return {
        icon: 'i-lucide-info',
        label: type,
      }
  }
}

function getTagData(tag: Tag) {
  switch (tag) {
    case 'permanent':
      return 'Постоянная акция'
    case 'optional':
      return 'Опционально'
    case 'temporary':
      return 'Временная акция'
    case 'advertising':
      return 'Реклама'
    default:
      return tag
  }
}
</script>
