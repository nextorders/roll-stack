<template>
  <div v-if="isFirstMessageOfDay" class="mt-6.5 mb-2.5 w-full flex flex-row items-center justify-center">
    <UBadge color="neutral" variant="soft">
      {{ isToday(new Date(message.createdAt)) ? 'Сегодня, ' : '' }}
      {{ format(new Date(message.createdAt), 'd MMMM', { locale: ru }) }}
    </UBadge>
  </div>

  <article class="group/message relative w-full scroll-mt-4 sm:scroll-mt-6">
    <div class="relative flex items-start gap-2 pb-2" :class="{ 'ms-auto max-w-[90%] md:max-w-[85%] lg:max-w-[70%] ltr:justify-end': side === 'right', 'rtl:justify-end': side === 'left' }">
      <div class="inline-flex items-center justify-center min-h-6 mt-1.5">
        <UserPopover :user="user">
          <UAvatar :src="user?.avatarUrl ?? ''" class="hover:scale-110 duration-200" />
        </UserPopover>
      </div>

      <TicketMessageText
        v-if="isMessageWithText && message"
        :message="message"
        :side="side"
      />
      <TicketMessageImage
        v-else-if="isMessageWithImage && message"
        :message="message"
        :side="side"
      />
      <TicketMessageFile
        v-else-if="isMessageWithFile && message"
        :message="message"
        :side="side"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { TicketMessage } from '@roll-stack/database'
import { format, isToday } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { message, isFirstMessageOfDay = false } = defineProps<{
  message: TicketMessage
  side: 'left' | 'right'
  isFirstMessageOfDay?: boolean
}>()

const userStore = useUserStore()
const user = computed(() => userStore.find(message.userId))

const isMessageWithText = computed(() => !message?.fileUrl)
const isMessageWithImage = computed(() => message?.fileUrl && message?.fileType === 'image')
const isMessageWithFile = computed(() => message?.fileUrl && message?.fileType !== 'image')
</script>
