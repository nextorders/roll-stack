<template>
  <UDrawer v-model:open="isNotificationsOpened" direction="right">
    <template #content>
      <div class="p-4 md:min-w-80 md:max-w-120 min-h-96 size-full overflow-auto">
        <div class="flex flex-col gap-2.5">
          <UCard v-if="!atriumUser">
            <div class="flex flex-col gap-3">
              <h3 class="text-highlighted text-lg/5 font-semibold flex gap-2 items-center">
                <UIcon name="simple-icons:telegram" class="size-6 text-info" /> Привяжи свой Telegram!
              </h3>

              <p>
                Чтобы получать важные уведомления и коды доступа.
              </p>

              <UButton
                variant="subtle"
                color="info"
                size="md"
                label="Открыть форму"
                class="w-fit"
                icon="i-lucide-square-arrow-out-up-right"
                @click="modalAttachTelegram.open({ userId: userStore.id ?? '', botId: atriumBotId })"
              />
            </div>
          </UCard>

          <UCard
            v-for="notification in notificationStore.notifications"
            :key="notification.id"
          >
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
import { ModalAttachTelegram } from '#components'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { isNotificationsOpened } = useApp()

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const atriumBotId = 'lwleg6bka2oo61x5ot6zog6h'
const atriumUser = computed(() => userStore.telegramUsers.find((telegramUser) => telegramUser.botId === atriumBotId && telegramUser.userId === userStore.id))

const overlay = useOverlay()
const modalAttachTelegram = overlay.create(ModalAttachTelegram)
</script>
