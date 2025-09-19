<template>
  <div class="w-2/3 relative flex flex-col justify-between gap-1.5">
    <div class="py-4 flex flex-col gap-2 items-center justify-center border border-default rounded-lg">
      <UIcon :name="getFileData(message.fileType).icon" class="size-10 text-primary" />

      <UButton
        variant="solid"
        color="secondary"
        :label="getFileData(message.fileType).label"
      />
    </div>
    <div v-if="message?.createdAt" class="flex justify-end text-xs text-muted">
      {{ format(new Date(message.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
    </div>
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
        label: 'Прикреплено фото',
      }
    case 'video':
      return {
        icon: 'i-lucide-video',
        label: 'Прикреплено видео',
      }
    case 'document':
      return {
        icon: 'i-lucide-file',
        label: 'Прикреплен документ',
      }
    default:
      return {
        icon: 'i-lucide-file',
        label: 'Прикреплен файл',
      }
  }
}
</script>
