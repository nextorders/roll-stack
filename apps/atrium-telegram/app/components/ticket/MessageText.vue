<template>
  <ActiveCard>
    <div class="w-full relative flex flex-col justify-between gap-2">
      <div class="flex flex-col gap-1">
        <div class="text-base/5 whitespace-break-spaces text-default font-medium">
          {{ message?.text }}
        </div>

        <div v-if="message?.createdAt" class="mt-1 flex justify-end text-xs text-muted">
          {{ format(new Date(message.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
        </div>
      </div>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { TicketMessage } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { message } = defineProps<{
  message: TicketMessage
}>()
</script>
