<template>
  <UForm
    :validate="createValidator(createFlowItemSchema)"
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

    <UFormField label="Текст" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Основной текст поста"
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
      :label="$t('common.create')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateFlowItem } from '@roll-stack/schema'
import { createFlowItemSchema } from '@roll-stack/schema'

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const { vibrate } = useFeedback()
const actionToast = useActionToast()

const flowStore = useFlowStore()
const userStore = useUserStore()

const state = ref<Partial<CreateFlowItem>>({
  title: undefined,
  description: undefined,
  type: 'user_post',
})

async function onSubmit(event: FormSubmitEvent<CreateFlowItem>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch('/api/flow', {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      flowStore.update(),
      userStore.update(),
    ])

    actionToast.success(toastId, t('toast.flow-item-created'))
    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
    vibrate('error')
  }
}
</script>
