<template>
  <UForm
    :validate="createValidator(completeBonusProgramRegistrationSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('common.name')"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      :label="$t('common.surname')"
      name="surname"
    >
      <UInput
        v-model="state.surname"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      :label="$t('common.email')"
      name="email"
      required
    >
      <UInput
        v-model="state.email"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      :label="$t('common.birth-date')"
      name="birthDate"
      required
    >
      <UInput
        v-model="state.birthDate"
        type="date"
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
      label="Завершить регистрацию"
      class="mt-3"
      :ui="{
        trailingIcon: 'ms-0',
      }"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { CompleteBonusProgramRegistration } from '#shared/services/client'
import type { FormSubmitEvent } from '@nuxt/ui'
import { completeBonusProgramRegistrationSchema } from '#shared/services/client'

const emit = defineEmits(['success', 'submitted'])

const { pop } = useConfetti()
const { vibrate } = useFeedback()
const clientStore = useClientStore()

const state = ref<Partial<CompleteBonusProgramRegistration>>({
  name: clientStore.name,
  surname: clientStore.surname,
  email: undefined,
  birthDate: undefined,
})

async function onSubmit(event: FormSubmitEvent<CompleteBonusProgramRegistration>) {
  emit('submitted')

  try {
    await $fetch('/api/auth/bonus', {
      method: 'POST',
      headers: {
        Authorization: `tma ${clientStore.initDataRaw}`,
      },
      body: event.data,
    })

    await Promise.all([
      clientStore.update(),
    ])

    vibrate('success')
    pop()
    emit('success')
  } catch (error) {
    console.error(error)
    vibrate('error')
  }
}
</script>
