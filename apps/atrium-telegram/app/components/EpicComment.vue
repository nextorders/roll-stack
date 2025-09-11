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
                {{ comment?.text }}
              </div>

              <div v-if="comment?.createdAt" class="mt-1 flex justify-end text-xs text-muted">
                {{ format(new Date(comment.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
              </div>
            </div>
          </div>
        </ActiveCard>
      </UDropdownMenu>

      <div v-if="comment?.notifications?.length" class="-mt-4 ml-4 flex flex-row flex-wrap gap-1">
        <UserBeacon
          v-for="notification in comment.notifications"
          :key="notification.id"
          :notification="notification"
        />
      </div>
    </div>
  </div>
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
      label: 'Скопировать сообщение',
      icon: 'i-lucide-copy',
      color: 'neutral',
      disabled: false,
      onSelect: () => navigator.clipboard.writeText(comment.value?.text ?? ''),
      condition: true,
    },
    {
      label: 'Маякнуть (будет позже)',
      icon: 'i-lucide-users-round',
      color: 'neutral',
      disabled: true,
      onSelect: () => modalCreateEpicCommentBeacon.open({ commentId }),
      condition: true,
    },
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
</script>
