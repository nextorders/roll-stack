<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-mail-question-mark" class="size-10 text-primary" />

        <UButton
          variant="soft"
          color="primary"
          size="xl"
          icon="i-lucide-pencil"
          @click="handleEdit()"
        />
      </div>

      <SectionTitle :title="ticket?.title ?? ''" />

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ ticket?.description }}
      </div>

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ user?.name }} {{ user?.surname }}, {{ user?.caption }}
      </div>

      <div class="mt-6 flex justify-between items-center">
        <div class="flex flex-row gap-4">
          <div class="flex flex-row gap-1.5 items-center text-muted text-sm">
            <UIcon name="i-lucide-message-circle" class="size-5" />
            <p>{{ ticket?.messages.length }} {{ pluralizationRu(ticket?.messages.length ?? 0, ['сообщение', 'сообщения', 'сообщений']) }}</p>
          </div>
        </div>

        <time
          v-if="ticket?.createdAt"
          :datetime="ticket.createdAt"
          class="text-sm text-muted"
          v-text="format(new Date(ticket.createdAt), 'от d MMMM yyyy', { locale: ru })"
        />
      </div>
    </Section>

    <UDrawer v-model:open="isDrawerOpened">
      <UButton
        variant="solid"
        color="secondary"
        size="xl"
        block
        class="items-center justify-center"
        icon="i-lucide-message-circle"
        label="Написать сообщение"
        @click="vibrate()"
      />

      <template #body>
        <FormCreateTicketMessage
          :ticket-id="ticket?.id ?? ''"
          @submitted="isDrawerOpened = false"
          @success="isDrawerOpened = false"
        />
      </template>
    </UDrawer>

    <div class="w-full flex flex-col gap-3.5 flex-1">
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
        class="mt-6 mx-auto px-8 w-fit items-center justify-center"
        icon="i-lucide-message-circle-more"
        :label="$t('common.show-more')"
        @click="handleClickShowMore()"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

definePageMeta({
  name: 'ticket-ticketId',
  canReturn: true,
})

const { params } = useRoute('ticket-ticketId')
const { vibrate } = useFeedback()

const partnerStore = usePartnerStore()
const ticketStore = useTicketStore()
const ticket = computed(() => ticketStore.tickets.find((t) => t.id === params.ticketId))
const partner = computed(() => partnerStore.partners.find((p) => p.id === ticket.value?.user.partnerId))
const user = computed(() => partner.value?.users.find((user) => user.id === ticket.value?.userId))

// On load show last 10 messages. On button click = show more 10 messages
const shownMessages = ref(10)
const messages = computed(() => ticket.value?.messages.slice(0, shownMessages.value))
const isShowMore = computed<boolean>(() => messages.value?.length && ticket.value?.messages.length ? messages.value.length < ticket.value.messages.length : false)

const isDrawerOpened = ref(false)

function handleClickShowMore() {
  vibrate('success')
  shownMessages.value += 10
}

function handleEdit() {
  vibrate()
}
</script>
