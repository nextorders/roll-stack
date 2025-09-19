<template>
  <div class="flex flex-row gap-2 items-start">
    <div class="mt-2.5">
      <UAvatar :src="user?.avatarUrl ?? undefined" />
    </div>
    <div class="w-full flex flex-col gap-1.5">
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
        <ActiveCard>
          <div class="w-full relative flex flex-col justify-between gap-2">
            <div class="flex flex-col gap-1">
              <div class="text-base/5 whitespace-break-spaces text-default font-medium">
                {{ message?.text }}
              </div>

              <div v-if="message?.fileUrl && message.fileType !== 'image'">
                <UButton
                  variant="solid"
                  color="secondary"
                  :icon="getFileIcon(message.fileType)"
                  @click="handleFileClick(message.fileUrl)"
                >
                  Прикрепленный файл
                </UButton>
              </div>
              <div v-else-if="message?.fileUrl && message.fileType === 'image'">
                <img
                  :src="message.fileUrl"
                  alt=""
                  class="w-full h-full object-contain rounded-lg"
                  @click="handleFileClick(message.fileUrl)"
                >
              </div>

              <div v-if="message?.createdAt" class="mt-1 flex justify-end text-xs text-muted">
                {{ format(new Date(message.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
              </div>
            </div>
          </div>
        </ActiveCard>
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
import type { TicketMessage } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

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

const items = computed<DropdownMenuItem[]>(() => {
  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Скопировать сообщение',
      icon: 'i-lucide-copy',
      color: 'neutral',
      disabled: false,
      onSelect: () => navigator.clipboard.writeText(message.value?.text ?? ''),
      condition: true,
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

function getFileIcon(type: TicketMessage['fileType']) {
  switch (type) {
    case 'image':
      return 'i-lucide-image'
    case 'video':
      return 'i-lucide-video'
    case 'document':
      return 'i-lucide-file'
    default:
      return 'i-lucide-file'
  }
}

function handleFileClick(fileUrl: string) {
  window.open(fileUrl, '_blank')
}
</script>
