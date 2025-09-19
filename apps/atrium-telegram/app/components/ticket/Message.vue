<template>
  <div class="flex flex-row gap-2 items-start">
    <div class="mt-2.5">
      <UAvatar :src="user?.avatarUrl ?? undefined" size="lg" />
    </div>
    <div class="relative w-full flex flex-col gap-1.5">
      <UDropdownMenu
        :items="items"
        :ui="{
          content: 'w-56',
          item: 'p-2 motion-preset-slide-left motion-duration-200',
        }"
        :content="{
          sideOffset: -32,
        }"
      >
        <TicketMessageText
          v-if="isMessageWithText && message"
          :message="message"
        />
        <TicketMessageImage
          v-else-if="isMessageWithImage && message"
          :message="message"
        />
        <TicketMessageFile
          v-else-if="isMessageWithFile && message"
          :message="message"
        />
      </UDropdownMenu>

      <!-- <div v-if="message?.notifications?.length" class="-mt-4 ml-4 flex flex-row flex-wrap gap-1">
        <UserBeacon
          v-for="notification in comment.notifications"
          :key="notification.id"
          :notification="notification"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { ticketId, messageId } = defineProps<{
  ticketId: string
  messageId: string
}>()

// const overlay = useOverlay()
// const modalCreateEpicCommentBeacon = overlay.create(ModalCreateEpicCommentBeacon)

const ticketStore = useTicketStore()
const userStore = useUserStore()

const ticket = computed(() => ticketStore.tickets.find((t) => t.id === ticketId))
const message = computed(() => ticket.value?.messages.find((m) => m.id === messageId))
const user = computed(() => userStore.find(message.value?.userId ?? ''))

const isMessageWithText = computed(() => !message.value?.fileUrl)
const isMessageWithImage = computed(() => message.value?.fileUrl && message.value?.fileType === 'image')
const isMessageWithFile = computed(() => message.value?.fileUrl && message.value?.fileType !== 'image')

const items = computed<DropdownMenuItem[]>(() => {
  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Открыть',
      icon: 'i-lucide-external-link',
      color: 'neutral',
      disabled: false,
      onSelect: () => handleFileClick(message.value?.fileUrl),
      condition: message.value?.fileUrl,
    },
    {
      label: 'Скопировать сообщение',
      icon: 'i-lucide-copy',
      color: 'neutral',
      disabled: false,
      onSelect: () => navigator.clipboard.writeText(message.value?.text ?? ''),
      condition: isMessageWithText.value,
    },
    // {
    //   label: 'Маякнуть (будет позже)',
    //   icon: 'i-lucide-users-round',
    //   color: 'neutral',
    //   disabled: true,
    //   onSelect: () => modalCreateEpicCommentBeacon.open({ messageId }),
    //   condition: true,
    // },
    {
      label: 'Лайкнуть (будет позже)',
      icon: 'i-lucide-thumbs-up',
      color: 'neutral',
      disabled: true,
      onSelect: () => {},
      condition: user.value?.id !== userStore.id,
    },
    {
      label: 'Редактировать',
      icon: 'i-lucide-edit',
      disabled: true,
      onSelect: () => {},
      condition: user.value?.id === userStore.id,
    },
    {
      label: 'Удалить',
      icon: 'i-lucide-trash-2',
      disabled: true,
      onSelect: () => {},
      condition: user.value?.id === userStore.id,
    },
  ]

  return menuItems.filter((item) => item.condition)
})

function handleFileClick(fileUrl: string | null | undefined) {
  if (!fileUrl) {
    return
  }
  window.open(fileUrl, '_blank')
}
</script>
