<template>
  <UCard
    variant="subtle"
    class="mt-auto bg-elevated/25"
  >
    <div v-if="!userStore.id" class="flex flex-row items-center justify-center">
      <Loader />
    </div>

    <UForm
      v-else
      :state="state"
      class="flex flex-col gap-3"
      @submit="onSubmit"
    >
      <UFormField name="text">
        <UTextarea
          v-model="state.text"
          color="neutral"
          required
          placeholder="Напишите свое сообщение..."
          size="xl"
          :rows="5"
          :disabled="loading"
          class="w-full"
          :ui="{ base: 'text-lg leading-6' }"
        />
      </UFormField>

      <div class="flex items-start justify-between gap-2">
        <!-- <UFormField name="files">
          <UFileUpload
            v-model="state.files"
            multiple
            :disabled="loading"
            class="w-full"
            label="Прикрепить файлы"
          />
        </UFormField> -->

        <UButton
          type="submit"
          color="secondary"
          size="xl"
          icon="i-lucide-send"
          class="px-6"
          :loading="loading"
          :disabled="!state.text"
          :label="$t('common.send')"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import type { CreateTicketMessage } from '#shared/services/ticket'
import type { FormSubmitEvent } from '@nuxt/ui'

const { id } = defineProps<{
  id: string
}>()

const toast = useToast()
const userStore = useUserStore()
const ticketStore = useTicketStore()

const loading = ref(false)

const state = ref<Partial<CreateTicketMessage>>({
  text: undefined,
})

function resetState() {
  state.value = {
    text: undefined,
  }
}

async function onSubmit(event: FormSubmitEvent<CreateTicketMessage>) {
  loading.value = true

  try {
    await $fetch(`/api/ticket/id/${id}/message`, {
      method: 'POST',
      body: event.data,
    })

    await ticketStore.update()

    resetState()
  } catch (error) {
    console.error(error)

    toast.add({
      title: 'Ошибка!',
      description: 'Добавить сообщение не удалось. Попробуйте еще раз.',
      icon: 'i-lucide-x',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
