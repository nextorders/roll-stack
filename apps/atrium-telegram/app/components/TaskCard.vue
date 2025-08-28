<template>
  <div class="w-full flex flex-row items-start gap-1">
    <UIcon
      v-if="isCompleted"
      name="i-lucide-check"
      class="shrink-0 mt-1.5 size-6 text-secondary"
    />
    <UCheckbox
      v-else-if="canComplete"
      v-model="checkbox"
      variant="list"
      icon="i-lucide-check"
      class="shrink-0 mt-1.5 duration-200 motion-preset-bounce"
      :ui="{
        base: 'size-6',
      }"
      @change="handleComplete"
    />
    <UCheckbox
      v-else
      v-model="checkbox"
      color="secondary"
      variant="list"
      icon="i-lucide-check"
      :ui="{
        base: 'size-6',
      }"
      class="shrink-0 mt-1.5 duration-200 motion-preset-bounce"
      disabled
    />

    <UDropdownMenu
      :items="items"
      :content="{
        sideOffset: -32,
      }"
      :ui="{
        content: 'w-48',
        item: 'p-2 motion-preset-slide-left motion-duration-200',
      }"
    >
      <UButton
        color="secondary"
        :variant="isFocused ? 'ghost' : 'ghost'"
        :trailing-icon="isFocused ? 'i-lucide-goal' : undefined"
        block
        :ui="{
          trailingIcon: [
            'self-start mt-0.5 text-dimmed',
            isFocused ? 'text-secondary' : undefined,
          ],
        }"
        class="group/task duration-200 motion-preset-bounce"
        @click="vibrate()"
      >
        <div class="w-full flex flex-col gap-2 items-start">
          <div class="flex flex-col gap-1 items-start text-left">
            <h4 class="text-base/5 font-medium tg-text">
              {{ task.name }}
            </h4>
            <p v-if="task.description" class="text-sm/4 text-muted font-normal">
              {{ task.description }}
            </p>
          </div>

          <div class="flex flex-row gap-y-1 gap-x-2 items-center">
            <UAvatar
              v-if="performer"
              :src="performer?.avatarUrl ?? ''"
              size="xs"
              class="shrink-0"
            />

            <UBadge
              v-if="task?.date"
              size="md"
              color="primary"
              variant="soft"
              icon="i-lucide-calendar"
              class="shrink-0"
            >
              {{ df.format(parseDate(task.date).toDate(getLocalTimeZone())) }}
            </UBadge>
          </div>
        </div>
      </UButton>
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '@roll-stack/database'
import { ModalCompleteTask, ModalUpdateTask } from '#components'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

const { task } = defineProps<{
  task: Task
}>()

const { vibrate } = useFeedback()
const taskStore = useTaskStore()
const userStore = useUserStore()

const list = computed(() => taskStore.lists.find((list) => list.id === task.listId))

const overlay = useOverlay()
const modalUpdateTask = overlay.create(ModalUpdateTask)
const modalCompleteTask = overlay.create(ModalCompleteTask)

const df = new DateFormatter('ru-RU', {
  dateStyle: 'long',
})

const isCompleted = computed(() => !!task.completedAt)
const performer = computed(() => userStore.staff.find((staff) => staff.id === task.performerId))

const canEdit = computed(() => list.value?.chat?.members.some((member) => member.userId === userStore.id) && !isCompleted.value)
const canComplete = computed(() => canEdit.value && !isCompleted.value && (task.performerId === userStore.id || !task.performerId))
const canFocus = computed(() => task.performerId === userStore.id && !isCompleted.value)
const isFocused = computed(() => task.id === performer.value?.focusedTaskId)

const checkbox = ref(false)

const items = computed<DropdownMenuItem[]>(() => {
  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Выполнить',
      icon: 'i-lucide-check',
      disabled: !canComplete.value,
      onSelect: () => {
        vibrate()
        modalCompleteTask.open({ taskId: task.id })
      },
      condition: canComplete.value,
    },
    {
      label: isFocused.value ? 'Убрать фокус' : 'Сфокусироваться',
      icon: 'i-lucide-goal',
      disabled: false,
      onSelect: () => {
        vibrate()
        isFocused.value ? onUnfocus() : onFocus()
      },
      condition: canFocus.value,
    },
    {
      label: 'Редактировать',
      icon: 'i-lucide-edit',
      disabled: isCompleted.value,
      onSelect: () => {
        vibrate()
        modalUpdateTask.open({ taskId: task.id })
      },
      condition: canEdit.value,
    },
  ]

  return menuItems.filter((item) => item.condition)
})

async function onFocus() {
  try {
    await taskStore.setAsFocused(task.id)
    await taskStore.update()
    await userStore.update()

    vibrate('success')
  } catch (error) {
    console.error(error)
    vibrate('error')
  }
}

async function onUnfocus() {
  try {
    await taskStore.setAsUnfocused(task.id)
    await taskStore.update()
    await userStore.update()

    vibrate('success')
  } catch (error) {
    console.error(error)
    vibrate('error')
  }
}

function handleComplete() {
  vibrate()

  if (!checkbox.value) {
    return
  }

  modalCompleteTask.open({ taskId: task.id })

  checkbox.value = false
}
</script>
