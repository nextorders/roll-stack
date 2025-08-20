<template>
  <article class="group/message relative w-full scroll-mt-4 sm:scroll-mt-6 motion-preset-slide-down-right">
    <div class="relative flex items-start gap-2 pb-2 rtl:justify-end">
      <div class="inline-flex items-center justify-center min-h-6 mt-1.5">
        <UserPopover :user="user">
          <UAvatar :src="user?.avatarUrl ?? ''" class="hover:scale-110 duration-200" />
        </UserPopover>
      </div>

      <div class="min-h-12 min-w-18 relative bg-elevated/25 px-3.5 py-2 rounded-lg ring ring-default">
        <div class="text-sm/4 md:text-base/5 whitespace-break-spaces text-pretty font-medium">
          {{ comment?.text }}
        </div>

        <div v-if="comment?.createdAt" class="mt-1 flex justify-end text-xs text-dimmed">
          {{ format(new Date(comment.createdAt), 'dd MMMM в HH:mm', { locale: ru }) }}
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { epicId, commentId } = defineProps<{
  epicId: string
  commentId: string
}>()

const epicStore = useEpicStore()
const userStore = useUserStore()

const epic = computed(() => epicStore.epics.find((epic) => epic.id === epicId))
const comment = computed(() => epic.value?.comments.find((comment) => comment.id === commentId))
const user = computed(() => userStore.find(comment.value?.userId ?? ''))
</script>
