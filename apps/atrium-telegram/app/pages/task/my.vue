<template>
  <PageContainer>
    <div class="flex flex-row gap-3.5 items-center">
      <div class="flex flex-col gap-1">
        <SectionTitle :title="`${userStore.name}, привет!`" />
        <p class="text-base/5">
          <template v-if="taskStore.myTodayTasks.length">
            Сегодня по плану еще
            <ULink
              as="button"
              class="font-semibold underline underline-offset-4 decoration-dashed decoration-1"
              :class="[
                taskStore.isTodayOnly ? 'tg-text' : 'text-secondary',
              ]"
              @click="() => {
                taskStore.isTodayOnly = !taskStore.isTodayOnly
                taskStore.isInFlowMode = false
              }"
            >
              {{ taskStore.myTodayTasks.length }} {{ pluralizationRu(taskStore.myTodayTasks.length, ['задача', 'задачи', 'задач']) }}
            </ULink>.
          </template>
          <span>
            Чем займемся?
          </span>
        </p>
      </div>
    </div>

    <template v-if="taskStore.isInitialized">
      <Section>
        <USwitch
          v-model="taskStore.isInFlowMode"
          size="xl"
          color="secondary"
          :label="taskStore.isInFlowMode ? `Режим &quot;Поток&quot;` : 'Режим &quot;Списки&quot;'"
          :ui="{
            root: 'items-center',
            label: 'ml-1.5 text-base/5 font-semibold',
          }"
          @change="vibrate()"
        />
      </Section>

      <div v-if="!taskStore.isInFlowMode" class="flex flex-col gap-8">
        <TaskList
          v-for="taskList in taskStore.myLists"
          :key="taskList.id"
          :list-id="taskList.id"
          :current-user-id="userStore.id as string"
        />

        <CreateCard
          v-if="!taskStore.isTodayOnly"
          :label="$t('app.create.task-list.button')"
          icon="i-lucide-list-todo"
          @click="modalCreateTaskList.open()"
        />
      </div>

      <div v-else>
        <div
          v-if="taskStore.myTasksOrderedByDate.length"
          class="w-full flex flex-col gap-2.5"
        >
          <TaskActiveCard
            v-for="task in taskStore.myTasksOrderedByDate"
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
    <div v-else>
      <div class="py-4 w-full flex justify-center">
        <Loader />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ModalCreateTaskList } from '#components'

definePageMeta({
  name: 'my-tasks',
})

const { vibrate } = useFeedback()

const overlay = useOverlay()
const modalCreateTaskList = overlay.create(ModalCreateTaskList)

const userStore = useUserStore()
const taskStore = useTaskStore()
</script>
