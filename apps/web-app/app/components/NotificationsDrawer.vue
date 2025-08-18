<template>
  <UDrawer v-model:open="isNotificationsOpened" direction="right">
    <template #content>
      <div class="p-4 min-w-80 max-w-120 min-h-96 size-full overflow-auto">
        <div class="flex flex-col gap-2.5">
          <UCard
            v-for="notification in notificationStore.notifications"
            :key="notification.id"
          >
            <div class="flex flex-col gap-3">
              <div class="flex flex-row gap-3 items-center">
                <UChip
                  color="error"
                  :show="!!notification.viewedAt"
                  inset
                >
                  <UAvatar
                    :src="notification.author.avatarUrl ?? undefined"
                    size="lg"
                  />
                </UChip>

                <div class="flex flex-col gap-0.5">
                  <h3 class="text-lg/6 font-semibold">
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
                <p class="text-base/5 font-medium whitespace-pre-wrap">
                  {{ notification.title }}
                </p>

                <p class="text-sm text-dimmed">
                  {{ notification.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { isNotificationsOpened } = useApp()

const notificationStore = useNotificationStore()
</script>
