<template>
  <div class="max-w-full overflow-x-scroll overflow-y-hidden snap-x hide-scroll">
    <div class="w-max flex flex-row flex-wrap gap-3.5">
      <div
        v-for="user in allUsers"
        :key="user.id"
        class="w-14 flex flex-col gap-1 justify-start items-center scroll-ml-6 snap-start motion-preset-slide-right"
        @click="handleClick(user.id)"
      >
        <div class="relative">
          <UAvatar
            :src="user?.avatarUrl ?? undefined"
            class="size-14 border-2 border-default"
            :class="[
              user.isOnline && 'border-primary',
            ]"
          />

          <div v-if="user.tasksCompletedToday" class="absolute -bottom-1 -right-1">
            <div class="relative size-6">
              <UIcon name="fluent:heart-32-filled" class="size-6 text-primary" />
              <div class="tg-text-button text-xs font-bold absolute bottom-1 right-2">
                {{ user.tasksCompletedToday }}
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs/3 text-muted text-center">
          {{ user.isOnline ? 'Онлайн' : useTimeAgoIntl(new Date(user.onlineAt ?? '')) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openTelegramLink, showPopup } from '@telegram-apps/sdk-vue'

const { vibrate } = useFeedback()

const userStore = useUserStore()
const taskStore = useTaskStore()

const users = computed(() => userStore.staff
  .map((staff) => {
    const userTasks = taskStore.lists.flatMap((list) => list.tasks).filter((task) => task.performerId === staff.id)
    const onlineInterval = 3 * 60 * 1000
    const isOnline = new Date(staff.onlineAt ?? '').getTime() > Date.now() - onlineInterval

    return {
      id: staff.id,
      avatarUrl: staff.avatarUrl,
      name: staff.name,
      surname: staff.surname,
      onlineAt: staff.onlineAt,
      tasksCompletedToday: userTasks.filter((task) => task.completedAt).length,
      isOnline,
    }
  })
  .sort((a, b) => new Date(b.onlineAt ?? '').getTime() - new Date(a.onlineAt ?? '').getTime()), // by online time
)

const onlineUsers = computed(() => users.value.filter((user) => user.isOnline))
const offlineUsers = computed(() => users.value.filter((user) => !user.isOnline))

const allUsers = computed(() => [...onlineUsers.value, ...offlineUsers.value])

async function handleClick(userId: string) {
  vibrate()

  // Open telegram profile
  const user = userStore.users.find((user) => user.id === userId)
  const telegramUser = user?.telegramUsers.find((telegramUser) => telegramUser.botId === 'lwleg6bka2oo61x5ot6zog6h')
  if (!user?.phone || !telegramUser?.telegramId) {
    return
  }

  if (showPopup.isAvailable()) {
    const buttonId = await showPopup({
      title: `${user.name} ${user.surname}`,
      message: 'Выберите действие',
      buttons: [
        {
          id: 'open',
          type: 'default',
          text: 'Открыть Telegram',
        },
        {
          type: 'close',
        },
      ],
    })

    if (buttonId === 'open') {
      openTelegramLink(`https://t.me/+${user.phone}?profile`)
    }
  }
}
</script>
