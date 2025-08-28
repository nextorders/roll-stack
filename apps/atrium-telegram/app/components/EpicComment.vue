<template>
  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-48',
      item: 'p-2 motion-preset-slide-left motion-duration-200',
    }"
    :content="{
      sideOffset: -32,
    }"
  >
    <UButton
      color="neutral"
      variant="link"
      active
      :ui="{
        base: 'p-0',
      }"
      class="group/message relative text-left scroll-mt-4 motion-preset-slide-left"
    >
      <div class="min-w-[60%] relative flex items-start gap-2 pb-2 rtl:justify-end">
        <div class="inline-flex items-center justify-center min-h-6 mt-1.5">
          <UAvatar :src="user?.avatarUrl ?? undefined" />
        </div>

        <div class="min-h-12 w-full bg-elevated/25 px-3.5 py-2 flex flex-col gap-2.5 rounded-lg ring ring-default">
          <div class="flex flex-col gap-1">
            <div v-if="comment?.createdAt" class="mt-1 flex justify-start text-xs text-dimmed">
              {{ format(new Date(comment.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
            </div>

            <div class="text-sm/4 whitespace-break-spaces text-default text-pretty font-medium">
              {{ comment?.text }}
            </div>
          </div>

          <div v-if="comment?.notifications?.length" class="flex flex-row flex-wrap gap-1">
            <UserBeacon
              v-for="notification in comment.notifications"
              :key="notification.id"
              :notification="notification"
            />
          </div>
        </div>
      </div>
    </UButton>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { ModalCreateEpicCommentBeacon } from '#components'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { epicId, commentId } = defineProps<{
  epicId: string
  commentId: string
}>()

const overlay = useOverlay()
const modalCreateEpicCommentBeacon = overlay.create(ModalCreateEpicCommentBeacon)

const epicStore = useEpicStore()
const userStore = useUserStore()

const epic = computed(() => epicStore.epics.find((epic) => epic.id === epicId))
const comment = computed(() => epic.value?.comments.find((comment) => comment.id === commentId))
const user = computed(() => userStore.find(comment.value?.userId ?? ''))

const items = computed<DropdownMenuItem[]>(() => {
  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Маякнуть',
      icon: 'i-lucide-users-round',
      color: 'neutral',
      disabled: false,
      onSelect: () => modalCreateEpicCommentBeacon.open({ commentId }),
      condition: true,
    },
    {
      label: 'Поставить лайк',
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
</script>
