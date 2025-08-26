<template>
  <div class="p-4 rounded-lg border border-default tg-bg group/list space-y-2.5">
    <div class="flex flex-row gap-2 items-center justify-between">
      <div class="flex flex-row gap-2.5 items-center">
        <UPopover
          v-if="activeChatMembers?.length"
          mode="hover"
          :content="{
            align: 'center',
            side: 'bottom',
            sideOffset: 8,
          }"
        >
          <UAvatarGroup
            :max="2"
            size="xs"
            :ui="{
              base: '-me-1.5',
            }"
          >
            <UAvatar
              v-for="member in activeChatMembers"
              :key="member.id"
              :src="member?.user.avatarUrl ?? undefined"
              alt=""
            />
          </UAvatarGroup>

          <template #content>
            <div class="h-auto w-fit px-1.5 py-2 flex flex-col gap-2">
              <UButtonGroup orientation="vertical">
                <UButton
                  v-for="member in activeChatMembers"
                  :key="member.id"
                  :to="`/staff/${member.user.id}`"
                  :avatar="{ src: member.user.avatarUrl ?? undefined }"
                  :ui="{
                    leadingAvatarSize: 'sm',
                  }"
                  :label="`${member.user.name} ${member.user.surname}`"
                  block
                  color="primary"
                  variant="link"
                  class="text-sm justify-start"
                />
              </UButtonGroup>
            </div>
          </template>
        </UPopover>

        <h3 class="text-lg/5 font-bold">
          {{ list?.name }}
        </h3>
      </div>

      <div v-if="canEdit" class="flex flex-row gap-2">
        <UTooltip :text="`Редактировать проект «${list?.name}»`">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            @click="modalUpdateTaskList.open({ listId })"
          />
        </UTooltip>

        <UTooltip :text="`${$t('app.create.task.button')} в проекте «${list?.name}»`">
          <UButton
            variant="solid"
            color="secondary"
            size="md"
            icon="i-lucide-plus"
            @click="modalCreateTask.open({ performerId: userStore.id, listId })"
          />
        </UTooltip>
      </div>
    </div>

    <div
      v-if="tasks.length"
      class="w-full flex flex-col gap-3"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>
    <template v-else>
      <p class="text-base text-dimmed">
        Активных задач нет
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ModalCreateTask, ModalUpdateTaskList } from '#components'
import { getLocalTimeZone, isToday, parseDate } from '@internationalized/date'

const { listId, currentUserId } = defineProps<{
  listId: string
  currentUserId: string
}>()

const userStore = useUserStore()
const taskStore = useTaskStore()

const list = computed(() => taskStore.lists.find((list) => list.id === listId))
const tasks = computed(() => list.value?.tasks.filter((t) => {
  // Need to show only with today date or completed today
  if (taskStore.isTodayOnly) {
    return t.date
      ? t.completedAt || isToday(parseDate(t.date), getLocalTimeZone())
      : false
  }

  return true
}) || [])

const activeChatMembers = computed(() =>
  list.value?.chat?.members
    .filter((member) => member.user.type !== 'bot')
    .filter((member) => member.user.id !== currentUserId),
)

const canEdit = computed(() => list.value?.chat?.members.some((member) => member.userId === userStore.id))

const overlay = useOverlay()
const modalCreateTask = overlay.create(ModalCreateTask)
const modalUpdateTaskList = overlay.create(ModalUpdateTaskList)
</script>
