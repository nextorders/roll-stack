<template>
  <UForm
    :validate="createValidator(completeTaskSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <div class="mb-4 flex flex-col gap-1">
      <h2 class="text-lg/5 font-semibold">
        «{{ task?.name }}»
      </h2>
      <p class="text-sm text-muted leading-4">
        {{ task?.description }}
      </p>
    </div>

    <UFormField :label="$t('common.resolution')" name="resolution">
      <USelectMenu
        v-model="selectedResolution"
        :items="getResolutionForSelect()"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('common.report')" name="report">
      <UTextarea
        v-model="state.report"
        :rows="4"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
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
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CompleteTask, Resolution } from '~~/shared/services/task'
import { completeTaskSchema } from '~~/shared/services/task'
import { getResolutionForSelect } from '~~/shared/utils/helpers'

const { taskId } = defineProps<{
  taskId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const { pop } = useConfetti()
const actionToast = useActionToast()
const userStore = useUserStore()
const taskStore = useTaskStore()

const task = computed(() => taskStore.lists.flatMap((list) => list.tasks).find((task) => task.id === taskId))

const state = ref<Partial<CompleteTask>>({
  resolution: 'success',
  report: undefined,
})

const selectedResolution = ref<{ label: string, value: Resolution, icon: string } | undefined>(
  getResolutionForSelect().find((resolution) => resolution.value === 'success'),
)

watch(selectedResolution, () => {
  state.value.resolution = selectedResolution.value?.value
})

async function onSubmit(event: FormSubmitEvent<CompleteTask>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/task/id/${taskId}/complete`, {
      method: 'POST',
      body: event.data,
    })

    await Promise.all([
      taskStore.update(),
      userStore.update(),
    ])

    actionToast.success(toastId, t('toast.task-completed'))
    pop()
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
