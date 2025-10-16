<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UAvatar :src="performer?.avatarUrl ?? undefined" class="size-8" />

        <UIcon
          :name="isCompleted ? 'i-lucide-check' : 'i-lucide-loader-circle'"
          class="shrink-0 size-8"
          :class="[
            isCompleted ? 'text-primary' : 'text-muted/50',
            !isCompleted && 'motion-preset-spin motion-duration-4000',
          ]"
        />
      </div>

      <h3 class="text-xl/6 font-bold">
        {{ task.name }}
      </h3>

      <div v-if="task.description" class="w-full text-base/5 font-normal whitespace-pre-wrap break-words line-clamp-8">
        {{ task.description }}
      </div>

      <div v-if="task.report" class="flex flex-row gap-2 items-start w-full">
        <UIcon name="i-lucide-clipboard-pen" class="shrink-0 size-5 text-primary" />
        <p class="text-base/5 font-semibold whitespace-pre-wrap break-words line-clamp-12">
          {{ task.report }}
        </p>
      </div>

      <div v-if="task?.completedAt" class="flex flex-row gap-2 items-start w-full">
        <UIcon name="i-lucide-calendar" class="shrink-0 size-5 text-primary" />
        <p class="text-base/5 font-semibold">
          {{ format(new Date(task.completedAt), 'd MMMM yyyy в HH:mm', { locale: ru }) }}
        </p>
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { Task } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { task } = defineProps<{
  task: Task
}>()

const userStore = useUserStore()

const isCompleted = computed(() => !!task.completedAt)
const performer = computed(() => userStore.staff.find((staff) => staff.id === task.performerId))
</script>
