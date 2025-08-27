<template>
  <PageContainer :back="false">
    <div class="flex flex-col md:flex-row gap-6 md:gap-2 md:items-center md:justify-between">
      <div class="flex flex-row gap-3.5 items-center">
        <UAvatar
          :src="userStore?.avatarUrl ?? undefined"
          class="size-14 cursor-pointer hover:scale-95 active:scale-90 duration-200"
          @click="handleUploadUserAvatar"
        />

        <div class="flex flex-col gap-1">
          <h2 class="text-xl/6 md:text-2xl lg:text-3xl font-bold tracking-tight">
            {{ userStore.name }}, привет!
          </h2>
          <p class="text-base/5 md:text-lg/5">
            <template v-if="myTodayTasks.length">
              Сегодня по плану еще
              <UTooltip :text="taskStore.isTodayOnly ? 'Показать все' : 'Показать сегодняшние'">
                <ULink
                  as="button"
                  class="font-semibold underline underline-offset-4 decoration-dashed decoration-1 cursor-pointer"
                  :class="[
                    taskStore.isTodayOnly ? 'tg-text' : 'text-secondary',
                  ]"
                  @click="taskStore.isTodayOnly = !taskStore.isTodayOnly"
                >
                  {{ myTodayTasks.length }} {{ pluralizationRu(myTodayTasks.length, ['задача', 'задачи', 'задач']) }}
                </ULink>
              </UTooltip>.
            </template>
            <span>
              Чем займемся?
            </span>
          </p>
        </div>
      </div>

      <div class="flex flex-row items-end justify-end">
        <TasksTodaySwitch />
      </div>
    </div>

    <div class="mb-20 grid grid-cols-1 gap-4">
      <TaskList
        v-for="taskList in myLists"
        :key="taskList.id"
        :list-id="taskList.id"
        :current-user-id="userStore.id as string"
      />

      <CreateCard
        :label="$t('app.create.task-list.button')"
        icon="i-lucide-list-todo"
        @click="modalCreateTaskList.open()"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ModalCreateTaskList, ModalUploadUserAvatar } from '#components'
import { getLocalTimeZone, isToday, parseDate } from '@internationalized/date'

const { vibrate } = useFeedback()

const overlay = useOverlay()
const modalCreateTaskList = overlay.create(ModalCreateTaskList)
const modalUploadUserAvatar = overlay.create(ModalUploadUserAvatar)

const userStore = useUserStore()
const taskStore = useTaskStore()

const myLists = computed(() =>
  taskStore.lists.filter(
    (taskList) => taskList.chat?.members.some((member) => member.userId === userStore.id),
  ).filter((taskList) => taskStore.isTodayOnly ? taskList.tasks.filter((task) => !task.completedAt && task.date && isToday(parseDate(task.date), getLocalTimeZone())).length : true),
)
const myTodayTasks = computed(() => myLists.value.flatMap((taskList) => taskList.tasks.filter((task) => !task.completedAt && task.date && isToday(parseDate(task.date), getLocalTimeZone()))))

function handleUploadUserAvatar() {
  vibrate()
  modalUploadUserAvatar.open()
}

useHead({
  title: 'Суши Атриум',
})
</script>
