<template>
  <UButton
    v-if="user"
    :avatar="{ src: user.avatarUrl ?? undefined }"
    :trailing-icon="notification.viewedAt ? 'i-lucide-check' : 'i-lucide-bell'"
    color="neutral"
    variant="outline"
    size="lg"
    class="relative py-1.5 rounded-full"
    :ui="{
      base: 'ring-muted',
      trailingIcon: notification.viewedAt ? 'text-secondary' : 'text-secondary motion-preset-pulse motion-duration-1200',
    }"
    @click="markAsViewed"
  />
</template>

<script setup lang="ts">
import type { Notification } from '@roll-stack/database'

const { notification } = defineProps<{
  notification: Notification
}>()

const { vibrate } = useFeedback()
const epicStore = useEpicStore()
const notificationStore = useNotificationStore()
const userStore = useUserStore()
const user = computed(() => userStore.find(notification.userId))

const canCheckAsViewed = computed(() => !notification.viewedAt && user.value?.id === userStore.id)

async function markAsViewed() {
  if (!canCheckAsViewed.value) {
    return
  }

  await notificationStore.markAsViewed(notification.id)
  vibrate('success')
  epicStore.update()
}
</script>
