<template>
  <div class="w-full flex flex-row items-start gap-1">
    <template v-if="isCompleted">
      <UPopover
        mode="hover"
        :content="{
          align: 'center',
          side: 'bottom',
          sideOffset: 8,
        }"
      >
        <div>
          <UIcon name="i-lucide-check" class="mt-1.5 size-5 text-secondary" />
        </div>

        <template #content>
          <div class="h-auto w-64 p-4 flex flex-col gap-2 text-sm/4">
            <h4 v-if="task.resolution" class="text-base/5 font-semibold">
              {{ getLocalizedResolution(task.resolution) }}
            </h4>

            {{ task.report }}
          </div>
        </template>
      </UPopover>
    </template>
    <UTooltip v-else-if="canComplete" text="Задача выполнена?">
      <UCheckbox
        v-model="checkbox"
        color="secondary"
        variant="list"
        size="xl"
        icon="i-lucide-check"
        class="mt-1.5 duration-200 motion-preset-bounce"
        @change="onStartCompleting"
      />
    </UTooltip>
    <UCheckbox
      v-else
      v-model="checkbox"
      color="secondary"
      variant="list"
      size="xl"
      icon="i-lucide-check"
      class="mt-1.5 duration-200 motion-preset-bounce"
      disabled
    />

    <UDropdownMenu
      :items="items"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        color="secondary"
        variant="ghost"
        :trailing-icon="isFocused ? 'i-lucide-goal' : 'i-lucide-ellipsis-vertical'"
        block
        :ui="{
          trailingIcon: [
            'self-start mt-0.5 text-dimmed',
            isFocused ? 'text-secondary' : undefined,
          ],
        }"
        class="group/task duration-200 motion-preset-bounce cursor-pointer"
        :class="{
          'bg-secondary/50 border-b-2 border-secondary': isFocused,
        }"
      >
        <div class="flex flex-col gap-2 items-start">
          <div class="flex flex-col gap-1 items-start text-left">
            <h4
              class="text-base/5 font-semibold"
              :class="[
                isFocused ? 'tg-text-button' : undefined,
              ]"
            >
              {{ task.name }}
            </h4>
            <p
              v-if="task.description"
              class="text-sm/4 text-neutral-500 transition duration-200"
              :class="[
                isFocused ? 'tg-text-button' : undefined,
              ]"
            >
              {{ task.description }}
            </p>
          </div>

          <div class="flex flex-row gap-y-1 gap-x-2 items-center">
            <UTooltip v-if="task.performerId" :text="`${performer?.name} ${performer?.surname}`">
              <UAvatar
                :src="performer?.avatarUrl ?? ''"
                size="xs"
                class="shrink-0"
              />
            </UTooltip>

            <UBadge
              v-if="task?.date"
              size="md"
              color="neutral"
              variant="outline"
              icon="i-lucide-calendar"
              :ui="{
                leadingIcon: 'text-dimmed',
              }"
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
import { getLocalizedResolution } from '#shared/utils/helpers'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

const { task } = defineProps<{
  task: Task
}>()

const { t } = useI18n()
const toast = useToast()
const actionToast = useActionToast()
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
const toastId = ref(`task-close-${task.id}`)

const items = computed<DropdownMenuItem[]>(() => {
  const menuItems: DropdownMenuItem[] = [
    {
      label: isFocused.value ? 'Убрать фокус' : 'Сфокусироваться',
      icon: 'i-lucide-goal',
      color: 'neutral',
      disabled: false,
      onSelect: isFocused.value ? onUnfocus : onFocus,
      condition: canFocus.value,
    },
    {
      label: 'Редактировать',
      icon: 'i-lucide-edit',
      disabled: isCompleted.value,
      onSelect: () => modalUpdateTask.open({ taskId: task.id }),
      condition: canEdit.value,
    },
  ]

  return menuItems.filter((item) => item.condition)
})

async function onFocus() {
  const toastId = actionToast.start()

  try {
    await taskStore.setAsFocused(task.id)
    await taskStore.update()
    await userStore.update()

    actionToast.success(toastId, t('toast.task-focused'))
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}

async function onUnfocus() {
  const toastId = actionToast.start()

  try {
    await taskStore.setAsUnfocused(task.id)
    await taskStore.update()
    await userStore.update()

    actionToast.success(toastId, t('toast.task-unfocused'))
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}

function onStartCompleting() {
  if (!checkbox.value) {
    return
  }

  modalCompleteTask.open({ taskId: task.id })

  checkbox.value = false

  toast.add({
    id: toastId.value,
    title: 'Закрываем задачу?',
    description: 'Сразу как успешную или есть что добавить? Заполните форму.',
    color: 'secondary',
    type: 'foreground',
    duration: 5000,
  })
}
</script>
