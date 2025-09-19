<template>
  <ActiveCard>
    <div class="flex flex-row gap-2 items-center">
      <UIcon name="i-lucide-mail-question-mark" class="size-8 text-primary" />

      <div v-if="hasAnswerFromUser" class="flex flex-row items-center gap-1.5 text-error">
        <UIcon
          name="i-lucide-pointer"
          class="size-8 motion-translate-y-loop-25 motion-preset-seesaw motion-duration-2000"
        />
        <p class="max-w-22 text-sm/4 font-bold">
          Есть ответ от партнера
        </p>
      </div>
    </div>

    <h3 class="text-xl/5 font-bold">
      {{ ticket.title }}
    </h3>

    <div class="w-full text-base/5 font-normal whitespace-pre-wrap break-words line-clamp-5">
      {{ ticket.description }}
    </div>

    <div class="mt-6 flex justify-between items-center">
      <div class="flex flex-row gap-4">
        <div class="flex flex-row gap-1.5 items-center text-sm text-muted">
          <UIcon name="i-lucide-message-circle" class="size-5" />
          <p>{{ ticket?.messages.length }}</p>
        </div>
      </div>

      <time
        :datetime="ticket.updatedAt"
        class="text-sm text-muted"
        v-text="format(new Date(ticket.updatedAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
      />
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { TicketWithData } from '~/stores/ticket'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { ticket } = defineProps<{
  ticket: TicketWithData
}>()

const hasAnswerFromUser = computed(() => ticket.lastMessage?.userId === ticket.userId)
</script>
