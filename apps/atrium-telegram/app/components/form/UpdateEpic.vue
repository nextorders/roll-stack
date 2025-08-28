<template>
  <UForm
    :validate="createValidator(updateEpicSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('common.title')"
      name="title"
      required
    >
      <UInput
        v-model="state.title"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('common.short-description')" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Суть. Для чего создается, что будет обсуждаться, что будет сделано?"
        autoresize
        size="xl"
        class="w-full"
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
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const userStore = useUserStore()
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
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await epicStore.update()

    actionToast.success(toastId, t('toast.epic-updated'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
