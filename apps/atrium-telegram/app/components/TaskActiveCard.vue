<template>
  <div>
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
      <TaskInfoCard :task="task" />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '@roll-stack/database'
import { ModalCompleteTask, ModalUpdateTask } from '#components'

const { task } = defineProps<{
  task: Task
}>()

const { vibrate } = useFeedback()

const userStore = useUserStore()
const taskStore = useTaskStore()

const list = computed(() => taskStore.lists.find((list) => list.id === task.listId))

const overlay = useOverlay()
const modalUpdateTask = overlay.create(ModalUpdateTask)
const modalCompleteTask = overlay.create(ModalCompleteTask)

const isCompleted = computed(() => !!task.completedAt)
const performer = computed(() => userStore.staff.find((staff) => staff.id === task.performerId))

const canEdit = computed(() => list.value?.chat?.members.some((member) => member.userId === userStore.id) && !isCompleted.value)
const canComplete = computed(() => canEdit.value && !isCompleted.value && (task.performerId === userStore.id || !task.performerId))
const canFocus = computed(() => task.performerId === userStore.id && !isCompleted.value)
const isFocused = computed(() => task.id === performer.value?.focusedTaskId)

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
    {
      label: 'Задача закрыта',
      icon: 'i-lucide-check',
      disabled: true,
      condition: isCompleted.value,
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
</script>
