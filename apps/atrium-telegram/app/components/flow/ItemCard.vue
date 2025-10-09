<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UAvatar
          v-if="item.userId && item.type === 'user_post'"
          :src="userAvatarUrl"
          class="size-8"
        />
        <UIcon
          v-else
          :name="getIconName(item.type)"
          class="size-8 text-primary"
        />

        <div v-if="!isViewed" class="flex flex-row items-center gap-1.5 text-error">
          <UIcon
            name="i-lucide-pointer"
            class="size-8 motion-translate-y-loop-25 motion-preset-seesaw motion-duration-2000"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            Не просмотрено
          </p>
        </div>
      </div>

      <h3 class="text-xl/5 font-bold">
        {{ item.title }}
      </h3>

      <div class="w-full text-base/5 font-normal whitespace-pre-wrap break-words line-clamp-8">
        {{ item.description }}
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-row gap-4">
          <div class="flex flex-row gap-1.5 items-center text-sm text-muted">
            <UIcon name="i-lucide-message-circle" class="size-5" />
            <p>{{ item?.comments.length }}</p>
          </div>
        </div>

        <time
          :datetime="item.createdAt"
          class="text-sm text-muted"
          v-text="format(new Date(item.createdAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
        />
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { item } = defineProps<{
  item: FlowItemWithData
}>()

const userStore = useUserStore()
const isViewed = computed(() => item.views.some((view) => view.userId === userStore?.id))
const userAvatarUrl = computed(() => userStore.users.find((user) => user.id === item.userId)?.avatarUrl ?? undefined)

function getIconName(type: FlowItemWithData['type']): string {
  switch (type) {
    case 'user_post':
      return 'i-lucide-square-user-round'
    case 'partner_maintenance':
      return 'i-lucide-user'
    case 'daily_task_report':
    case 'weekly_task_report':
      return 'i-lucide-clipboard-check'
    default:
      return 'i-lucide-clipboard'
  }
}
</script>
