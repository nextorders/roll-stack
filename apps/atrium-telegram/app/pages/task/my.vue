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
              @click="taskStore.isTodayOnly = !taskStore.isTodayOnly"
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
        <TasksTodaySwitch />
      </Section>

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

const overlay = useOverlay()
const modalCreateTaskList = overlay.create(ModalCreateTaskList)

const userStore = useUserStore()
const taskStore = useTaskStore()
</script>
