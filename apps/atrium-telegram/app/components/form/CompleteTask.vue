<template>
  <UForm
    :validate="createValidator(completeTaskSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <div class="mb-4 flex flex-col gap-1">
      <h2 class="text-base/5 font-medium">
        {{ task?.name }}
      </h2>
      <p class="text-sm/4 text-muted">
        {{ task?.description }}
      </p>
    </div>

    <UFormField :label="$t('app.report')" name="report">
      <UTextarea
        v-model="state.report"
        :rows="4"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="lg"
      trailing-icon="i-lucide-flag"
      block
      :label="$t('app.update.task.close')"
      :ui="{
        trailingIcon: 'ms-0',
      }"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CompleteTask } from '#shared/services/task'
import type { FormSubmitEvent } from '@nuxt/ui'
import { completeTaskSchema } from '#shared/services/task'

const { taskId } = defineProps<{
  taskId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()
const userStore = useUserStore()
const taskStore = useTaskStore()

const task = computed(() => taskStore.lists.flatMap((list) => list.tasks).find((task) => task.id === taskId))

const state = ref<Partial<CompleteTask>>({
  resolution: 'success',
  report: undefined,
})

async function onSubmit(event: FormSubmitEvent<CompleteTask>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/id/${taskId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      taskStore.update(),
      userStore.update(),
    ])

    actionToast.success(toastId, t('toast.task-completed'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
