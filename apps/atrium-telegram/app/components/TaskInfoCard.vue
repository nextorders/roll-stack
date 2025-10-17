<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UAvatar :src="performer?.avatarUrl ?? undefined" class="size-8" />

        <div v-if="isCompleted" class="flex flex-row gap-1 items-center text-primary">
          <UIcon
            name="i-lucide-check"
            class="shrink-0 size-8 text-primary"
          />
          <p v-if="task.completedAt" class="text-base/5 font-semibold">
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

const isFocused = computed(() => task.id === performer.value?.focusedTaskId)
</script>
