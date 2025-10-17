<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
      <div class="flex flex-row gap-2 items-center">
        <UAvatar :src="performer?.avatarUrl ?? undefined" class="size-8" />

        <div v-if="isCompleted" class="flex flex-row gap-1 items-center text-primary">
          <UIcon
            name="i-lucide-check"
            class="shrink-0 size-8 text-primary"
          />
          <p v-if="task?.completedAt" class="text-base/5 font-semibold">
            {{ format(new Date(task.completedAt), 'd MMMM yyyy в HH:mm', { locale: ru }) }}
          </p>
        </div>
        <UIcon
          v-else
          name="i-lucide-loader-circle"
          class="shrink-0 size-8 text-muted/50 motion-preset-spin motion-duration-4000"
        />

        <div v-if="isFocused" class="flex flex-row items-center gap-1.5 text-primary">
          <UIcon
            name="i-lucide-goal"
            class="shrink-0 size-8 motion-preset-seesaw"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            В Фокусе
          </p>
        </div>
      </div>

      <SectionTitle :title="task?.name ?? ''" />

      <div v-if="task?.description" class="w-full text-base/5 font-normal whitespace-pre-wrap break-words">
        {{ task.description }}
      </div>

      <div v-if="task?.report" class="flex flex-row gap-2 items-start w-full">
        <UIcon name="i-lucide-clipboard-pen" class="shrink-0 size-6 text-primary" />
        <p class="text-base/5 font-semibold whitespace-pre-wrap break-words">
          {{ task.report }}
        </p>
      </div>

      <div v-if="task?.date" class="flex flex-row gap-2 items-start w-full">
        <UIcon name="i-lucide-calendar" class="shrink-0 size-6 text-primary" />
        <p class="text-base/5 font-semibold whitespace-pre-wrap break-words">
          {{ format(new Date(task.date), 'd MMMM yyyy', { locale: ru }) }}
        </p>
      </div>

      <div v-if="taskList" class="flex flex-row gap-2 items-start w-full">
        <UIcon name="i-lucide-book-marked" class="shrink-0 size-6 text-primary" />
        <p class="text-base/5 font-semibold whitespace-pre-wrap break-words">
          {{ taskList.name }}
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-0.5">
        <div class="text-sm text-muted">
          Создана
          <time
            v-if="task?.createdAt"
            :datetime="task.createdAt"
            v-text="format(new Date(task.createdAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
          />
        </div>

        <div v-if="task?.updatedAt" class="text-sm text-muted">
          Обновлена
          <time
            :datetime="task.updatedAt"
            v-text="format(new Date(task.updatedAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
          />
        </div>

        <div v-if="task?.completedAt" class="text-sm text-muted">
          Закрыта
          <time
            :datetime="task.completedAt"
            v-text="format(new Date(task.completedAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
          />
        </div>
      </div>
    </Section>
  </PageContainer>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

definePageMeta({
  name: 'task-taskId',
})

const { params } = useRoute('task-taskId')

const userStore = useUserStore()
const taskStore = useTaskStore()
const task = computed(() => taskStore.tasks.find((t) => t.id === params.taskId))
const taskList = computed(() => taskStore.lists.find((t) => t.id === task.value?.listId))

const isCompleted = computed(() => !!task.value?.completedAt)
const performer = computed(() => userStore.staff.find((staff) => staff.id === task.value?.performerId))

const isFocused = computed(() => task.value?.id === performer.value?.focusedTaskId)
</script>
