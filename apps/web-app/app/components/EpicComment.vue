<template>
  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'w-48',
    }"
  >
    <UButton
      color="neutral"
      variant="link"
      trailing-icon="i-lucide-ellipsis-vertical"
      active
      :ui="{
        base: 'p-0',
        trailingIcon: 'self-start mt-0.5 text-dimmed opacity-0 group-hover/message:opacity-100 transition duration-200',
      }"
      class="group/message relative text-left scroll-mt-4 sm:scroll-mt-6 motion-preset-slide-down-right"
    >
      <div class="relative flex items-start gap-2 pb-2 rtl:justify-end">
        <div class="inline-flex items-center justify-center min-h-6 mt-1.5">
          <UserPopover :user="user">
            <UAvatar :src="user?.avatarUrl ?? ''" class="hover:scale-110 duration-200" />
          </UserPopover>
        </div>

        <div class="min-h-12 min-w-18 bg-elevated/25 px-3.5 py-2 flex flex-col gap-2.5 rounded-lg ring ring-default">
          <div>
            <div class="text-sm/4 md:text-base/5 whitespace-break-spaces text-pretty font-medium">
              {{ comment?.text }}
            </div>

            <div v-if="comment?.createdAt" class="mt-1 flex justify-end text-xs text-dimmed">
              {{ format(new Date(comment.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
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
