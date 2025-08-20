<template>
  <UForm
    :validate="createValidator(updateEpicSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.title')" name="title">
      <UInput
        v-model="state.title"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.short-description')" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Суть. Для чего создается, что будет обсуждаться, что будет сделано?"
        autoresize
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="secondary"
      size="xl"
      block
      class="mt-3"
      :label="$t('common.update')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { UpdateEpic } from '#shared/services/epic'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updateEpicSchema } from '#shared/services/epic'

const { epicId } = defineProps<{
  epicId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const epicStore = useEpicStore()
const epic = computed(() => epicStore.epics.find((e) => e.id === epicId))

const state = ref<Partial<UpdateEpic>>({
  title: epic.value?.title,
  description: epic.value?.description ?? undefined,
})

async function onSubmit(event: FormSubmitEvent<UpdateEpic>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/epic/id/${epicId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await epicStore.update()

    actionToast.success(toastId, t('toast.epic-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
