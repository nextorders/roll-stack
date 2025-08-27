<template>
  <UForm
    :validate="createValidator(updateTaskSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('common.title')"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        size="lg"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        :rows="4"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Исполнитель" name="performerId">
      <USelectMenu
        v-model="selectedPerformer"
        :items="availablePerformersItems"
        :avatar="selectedPerformer?.avatar"
        :placeholder="$t('common.select')"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-1">
      <UPopover>
        <UFormField :label="$t('common.date')" name="date">
          <UInput
            :value="selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : ''"
            placeholder="Выберите дату"
            size="lg"
            class="w-full items-center justify-center cursor-pointer"
            :ui="{ trailing: 'pe-1.5' }"
          >
            <template v-if="selectedDate" #trailing>
              <UButton
                color="neutral"
                variant="ghost"
                size="md"
                icon="i-lucide-x"
                @click="selectedDate = undefined"
              />
            </template>
          </UInput>
        </UFormField>

        <template #content>
          <UCalendar v-model="selectedDate" class="p-2" />
        </template>
      </UPopover>
    </div>

    <UFormField label="В проекте" name="listId">
      <USelectMenu
        v-model="selectedList"
        :items="availableLists"
        :placeholder="$t('common.select')"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="mt-3 flex flex-row gap-3">
      <UButton
        type="submit"
        variant="solid"
        color="secondary"
        size="lg"
        block
        :label="$t('common.update')"
      />

      <UButton
        variant="soft"
        color="error"
        size="lg"
        icon="i-lucide-trash-2"
        class="aspect-square justify-center"
        @click="onDelete"
      />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { UpdateTask } from '#shared/services/task'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateTaskSchema } from '#shared/services/task'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

const { taskId } = defineProps<{
  taskId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const userStore = useUserStore()

const availablePerformers = computed(() => userStore.staff.filter((s) => list.value?.chat?.members.some((m) => m.user.id === s.id)))
const availablePerformersItems = computed(() => [{
  label: 'Без исполнителя',
  value: '',
  avatar: {
    src: undefined,
    alt: '',
  },
}, ...availablePerformers.value.map((staff) => ({
  label: `${staff.name} ${staff.surname}`,
  value: staff.id,
  avatar: {
    src: staff.avatarUrl ?? undefined,
    alt: '',
  },
}))])

const taskStore = useTaskStore()
const list = computed(() => taskStore.lists.find((list) => list.tasks.find((task) => task.id === taskId)))
const task = computed(() => list.value?.tasks.find((task) => task.id === taskId))

const availableLists = computed(() => taskStore.lists.filter((taskList) => taskList.chat?.members.some((member) => member.userId === userStore.id)).map((list) => ({
  label: list.name,
  value: list.id,
})))

const selectedList = ref<{ label: string, value: string } | undefined>(list.value ? { label: list.value.name, value: list.value.id } : undefined)

watch(selectedList, () => {
  state.value.listId = selectedList.value?.value
})

const state = ref<Partial<UpdateTask>>({
  name: task.value?.name,
  description: task.value?.description ?? undefined,
  performerId: task.value?.performerId,
  date: task.value?.date,
  listId: task.value?.listId,
})

const selectedPerformer = ref<{ label: string, value: string, avatar: { src: string | undefined, alt: string } } | undefined>(state.value.performerId ? availablePerformersItems.value.find((performer) => performer?.value === state.value.performerId) : undefined)

watch(selectedPerformer, () => {
  if (selectedPerformer.value?.value === '') {
    state.value.performerId = null
    return
  }

  state.value.performerId = selectedPerformer.value?.value
})

const df = new DateFormatter('ru-RU', {
  dateStyle: 'long',
})

const selectedDate = shallowRef<CalendarDate | undefined>(task.value?.date ? parseDate(task.value?.date) : undefined)

watch(selectedDate, () => {
  if (!selectedDate.value) {
    state.value.date = null
    return
  }

  state.value.date = selectedDate.value.toString()
})

async function onSubmit(event: FormSubmitEvent<UpdateTask>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/id/${taskId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await taskStore.update()

    actionToast.success(toastId, t('toast.task-updated'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}

async function onDelete() {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/id/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
    })

    await taskStore.update()

    actionToast.success(toastId, t('toast.task-deleted'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
