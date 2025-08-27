<template>
  <UForm
    :validate="createValidator(createTaskSchema)"
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
        :placeholder="$t('app.task.name-placeholder')"
        size="lg"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('app.task.description')" name="description">
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
        :content="{
          side: 'top',
        }"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="grid grid-cols-1 md:grid-cols-2">
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

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="lg"
      block
      class="mt-3"
      :label="$t('common.create')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CreateTask } from '#shared/services/task'
import type { CalendarDate } from '@internationalized/date'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createTaskSchema } from '#shared/services/task'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const { performerId, listId } = defineProps<{
  performerId?: string
  listId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const taskStore = useTaskStore()
const userStore = useUserStore()

const list = computed(() => taskStore.lists.find((list) => list.id === listId))

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

const state = ref<Partial<CreateTask>>({
  name: undefined,
  description: undefined,
  date: undefined,
  performerId,
  listId,
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

const selectedDate = shallowRef<CalendarDate | undefined>()

watch(selectedDate, () => {
  if (!selectedDate.value) {
    state.value.date = null
    return
  }

  state.value.date = selectedDate.value.toString()
})

async function onSubmit(event: FormSubmitEvent<CreateTask>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task`, {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await taskStore.update()

    actionToast.success(toastId, t('toast.task-created'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
