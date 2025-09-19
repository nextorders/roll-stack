<template>
  <UForm
    :validate="createValidator(createTicketMessageSchema)"
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
import type { CreateTicketMessage } from '#shared/services/ticket'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createTicketMessageSchema } from '#shared/services/ticket'

const { ticketId } = defineProps<{ ticketId: string }>()

const emit = defineEmits(['success', 'submitted'])

const { vibrate } = useFeedback()
const userStore = useUserStore()
const ticketStore = useTicketStore()

const state = ref<Partial<CreateTicketMessage>>({
  text: undefined,
})

async function onSubmit(event: FormSubmitEvent<CreateTicketMessage>) {
  emit('submitted')

  try {
    await $fetch(`/api/ticket/id/${ticketId}/message`, {
      method: 'POST',
      headers: {
        Authorization: `tma ${userStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      ticketStore.update(),
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
