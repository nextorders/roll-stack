<template>
  <UForm
    :validate="createValidator(createEpicSchema)"
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
      :label="$t('common.create')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateEpic } from '~~/shared/services/epic'
import { createEpicSchema } from '~~/shared/services/epic'

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const epicStore = useEpicStore()
const userStore = useUserStore()

const state = ref<Partial<CreateEpic>>({
  title: undefined,
  description: undefined,
})

async function onSubmit(event: FormSubmitEvent<CreateEpic>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch('/api/epic', {
      method: 'POST',
      body: event.data,
    })

    await Promise.all([
      epicStore.update(),
      userStore.update(),
    ])

    actionToast.success(toastId, t('toast.epic-created'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
