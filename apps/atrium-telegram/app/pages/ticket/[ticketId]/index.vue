<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-mail-question-mark" class="size-10 text-primary" />
      </div>

      <h1 class="text-2xl/6 font-bold">
        {{ ticket?.title }}
      </h1>

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ ticket?.description }}
      </div>
    </Section>

    <Section class="flex flex-row justify-between items-center">
      <div class="flex flex-row items-center gap-2">
        <UIcon name="i-lucide-message-circle" class="size-5" />
        {{ ticket?.messages.length }} {{ pluralizationRu(ticket?.messages.length ?? 0, ['сообщение', 'сообщения', 'сообщений']) }}
      </div>
    </Section>

    <div class="w-full flex flex-col gap-3.5 flex-1 last-of-type:mb-20">
      <TicketMessage
        v-for="message in messages"
        :key="message.id"
        :ticket-id="message.ticketId"
        :message-id="message.id"
      />

      <UButton
        v-if="isShowMore"
        variant="solid"
        color="secondary"
        size="xl"
        class="w-full items-center justify-center"
        icon="i-lucide-message-circle"
        :label="$t('common.show-more')"
        @click="handleClickShowMore()"
      />
    </div>

    <!-- <UDrawer v-model:open="isDrawerOpened">
      <CreateCard
        v-if="epic?.id"
        :label="$t('app.create.epic-comment.button')"
        icon="i-lucide-message-circle"
      />

      <template #body>
        <FormCreateEpicComment
          :epic-id="epic?.id ?? ''"
          @submitted="isDrawerOpened = false"
          @success="isDrawerOpened = false"
        />
      </template>
    </UDrawer> -->
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'ticket-ticketId',
  canReturn: true,
})

const { params } = useRoute('ticket-ticketId')
const { vibrate } = useFeedback()

const ticketStore = useTicketStore()
const ticket = computed(() => ticketStore.tickets.find((e) => e.id === params.ticketId))

// On load show last 10 messages. On button click = show more 10 messages
const shownMessages = ref(10)
const messages = computed(() => ticket.value?.messages.slice(0, shownMessages.value))
const isShowMore = computed<boolean>(() => messages.value?.length && ticket.value?.messages.length ? messages.value.length < ticket.value.messages.length : false)

// const isDrawerOpened = ref(false)

function handleClickShowMore() {
  vibrate()
  shownMessages.value += 10
}
</script>
