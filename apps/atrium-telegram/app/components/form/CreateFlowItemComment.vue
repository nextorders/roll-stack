<template>
  <UForm
    :validate="createValidator(createFlowItemCommentSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField label="Ваше сообщение" name="text">
      <UTextarea
        v-model="state.text"
        placeholder="Не торопись, осмотрись..."
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
      icon="i-lucide-send"
      block
      class="mt-3"
      :disabled="!state.text"
      :label="$t('common.send')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CreateFlowItemComment } from '#shared/services/flow'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createFlowItemCommentSchema } from '#shared/services/flow'

const { itemId } = defineProps<{ itemId: string }>()

const emit = defineEmits(['success', 'submitted'])

const { vibrate } = useFeedback()
const userStore = useUserStore()
const flowStore = useFlowStore()

const state = ref<Partial<CreateFlowItemComment>>({
  text: undefined,
})

async function onSubmit(event: FormSubmitEvent<CreateFlowItemComment>) {
  emit('submitted')

  try {
    await $fetch(`/api/flow/id/${itemId}/comment`, {
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

    vibrate('success')
    emit('success')
  } catch (error) {
    console.error(error)
    vibrate('error')
  }
}
</script>
