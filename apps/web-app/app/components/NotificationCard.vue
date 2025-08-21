<template>
  <UCard>
    <div class="flex flex-col gap-3">
      <div class="flex flex-row gap-3 items-center">
        <UChip
          color="error"
          :show="!notification.viewedAt"
          inset
        >
          <UAvatar
            :src="notification.author.avatarUrl ?? undefined"
            size="lg"
          />
        </UChip>

        <div class="flex flex-col gap-0.5">
          <h3 class="text-base/5 font-semibold">
            {{ notification.author.name }} {{ notification.author.surname }}
          </h3>

          <time
            :datetime="notification.createdAt"
            class="text-sm text-muted"
            v-text="format(new Date(notification.createdAt), 'd MMMM в HH:mm', { locale: ru })"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm/4 md:text-base/5 font-medium whitespace-pre-wrap">
          {{ notification.title }}
        </p>

        <p class="text-sm/4 text-dimmed">
          {{ notification.description }}
        </p>
      </div>

      <div v-if="notification.epicId">
        <UButton
          :to="`/epic/${notification.epicId}`"
          variant="outline"
          color="neutral"
          size="sm"
          icon="i-lucide-crown"
          label="Открыть эпик"
        />
      </div>

      <div v-if="!notification.viewedAt">
        <UButton
          variant="outline"
          color="neutral"
          size="sm"
          icon="i-lucide-check"
          label="Отметить как просмотренное"
          @click="notificationStore.markAsViewed(notification.id)"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { NotificationWithEntities } from '~/stores/notification'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

defineProps<{
  notification: NotificationWithEntities
}>()

const notificationStore = useNotificationStore()
</script>
