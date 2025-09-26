<template>
  <div
    class="min-h-12 min-w-18 relative bg-elevated/50 px-3.5 py-2 rounded-lg"
    :class="[
      side === 'left' && 'text-neutral-900 md:max-w-[85%] lg:max-w-[70%] bg-orange-50 dark:bg-orange-100 border-b-2 border-orange-200 dark:border-orange-300',
    ]"
  >
    <div class="w-full relative flex flex-col justify-between gap-2">
      <div class="flex flex-col gap-1">
        <div class="text-base/5 whitespace-break-spaces text-default font-medium">
          {{ message?.text }}
        </div>

        <div v-if="message?.createdAt" class="mt-1 flex justify-end text-xs text-muted">
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
</script>
