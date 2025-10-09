<template>
  <div class="w-2/3 relative flex flex-col justify-between gap-1.5">
    <ActiveCard>
      <Section>
        <div class="w-full relative flex flex-col justify-between gap-2">
          <div class="p-2 w-16 h-10 flex flex-row items-center justify-center bg-primary rounded-md">
            <UIcon :name="getFileData(message.fileType).icon" class="size-6 tg-text-button" />
          </div>

          <div class="text-base/5 whitespace-break-spaces text-default font-medium">
            {{ getFileData(message.fileType).label }}
          </div>

          <div v-if="message?.createdAt" class="flex justify-end text-xs text-muted">
            {{ format(new Date(message.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
          </div>
        </div>
      </Section>
    </ActiveCard>
  </div>
</template>

<script setup lang="ts">
import type { TicketMessage } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { message } = defineProps<{
  message: TicketMessage
}>()

function getFileData(type: TicketMessage['fileType']) {
  switch (type) {
    case 'image':
      return {
        icon: 'i-lucide-image',
        label: 'Загружено фото',
      }
    case 'video':
      return {
        icon: 'i-lucide-video',
        label: 'Загружено видео',
      }
    case 'document':
      return {
        icon: 'i-lucide-file',
        label: 'Загружен документ',
      }
    default:
      return {
        icon: 'i-lucide-file',
        label: 'Загружен файл',
      }
  }
}
</script>
