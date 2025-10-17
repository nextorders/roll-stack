<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex flex-row gap-2.5 items-center justify-between">
      <SectionTitle :title="list?.name ?? ''" />

      <UButton
        v-if="canEdit"
        variant="solid"
        color="secondary"
        icon="i-lucide-plus"
        label="Создать"
        @click="handleCreateTask()"
      />
    </div>

    <Section class="py-2">
      <div class="flex flex-row items-center justify-between">
        <div class="h-8">
          <UAvatarGroup
            v-if="activeChatMembers?.length"
            :max="3"
            size="md"
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
        </div>

        <div v-if="canEdit" class="flex flex-row gap-2">
          <UButton
            variant="soft"
            color="primary"
            size="xl"
            icon="i-lucide-pencil"
            class="h-10"
            @click="handleEditTaskList()"
          />
        </div>
      </div>
    </Section>

    <div
      v-if="tasks.length"
      class="w-full flex flex-col gap-2.5"
    >
      <TaskActiveCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>
    <template v-else>
      <p class="text-center text-base text-muted">
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

const { vibrate } = useFeedback()
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

function handleEditTaskList() {
  vibrate()
  modalUpdateTaskList.open({ listId })
}

function handleCreateTask() {
  vibrate()
  modalCreateTask.open({ performerId: userStore.id, listId })
}
</script>
