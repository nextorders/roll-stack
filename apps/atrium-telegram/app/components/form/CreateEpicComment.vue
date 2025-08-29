<template>
  <UForm
    :validate="createValidator(createEpicCommentSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField label="Комментарий" name="text">
      <UTextarea
        v-model="state.text"
        placeholder="Напишите свою мысль..."
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
import type { CreateEpicComment } from '#shared/services/epic'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createEpicCommentSchema } from '#shared/services/epic'

const { epicId } = defineProps<{ epicId: string }>()

const emit = defineEmits(['success', 'submitted'])

const { vibrate } = useFeedback()
const userStore = useUserStore()
const epicStore = useEpicStore()

const state = ref<Partial<CreateEpicComment>>({
  text: undefined,
})

async function onSubmit(event: FormSubmitEvent<CreateEpicComment>) {
  emit('submitted')

  try {
    await $fetch(`/api/epic/id/${epicId}/comment`, {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      epicStore.update(),
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
