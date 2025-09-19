<template>
  <div v-if="message.fileUrl" class="w-2/3 relative flex flex-col justify-between gap-1.5">
    <img
      :src="message.fileUrl"
      alt=""
      class="w-full h-full object-contain rounded-lg active:scale-95 duration-200"
    >
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
</script>
