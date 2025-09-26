<template>
  <div class="w-2/3 relative flex flex-col justify-between gap-1.5">
    <div
      class="min-h-12 min-w-18 relative bg-elevated/50 px-3.5 py-2 rounded-lg"
      :class="[
        side === 'left' && 'text-neutral-900 md:max-w-[85%] lg:max-w-[70%] bg-orange-50 dark:bg-orange-100 border-b-2 border-orange-200 dark:border-orange-300',
      ]"
    >
      <div class="w-full relative flex flex-col justify-between gap-2">
        <div class="p-2 w-16 h-10 flex flex-row items-center justify-center bg-secondary rounded-md">
          <UIcon :name="getFileData(message.fileType).icon" class="size-6 text-white" />
        </div>

        <div class="text-base/5 whitespace-break-spaces text-default font-medium">
          {{ getFileData(message.fileType).label }}
        </div>

        <div v-if="message?.createdAt" class="flex justify-end text-xs text-muted">
          {{ format(new Date(message.createdAt), 'HH:mm') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TicketMessage } from '@roll-stack/database'
import { format } from 'date-fns'

const { message } = defineProps<{
  message: TicketMessage
  side: 'left' | 'right'
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
