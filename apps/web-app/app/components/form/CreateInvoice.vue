<template>
  <UForm
    :validate="createValidator(createPartnerInvoiceSchema)"
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
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      :label="$t('common.description')"
      name="description"
    >
      <UInput
        v-model="state.description"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Тип" name="type">
      <USelect
        v-model="state.type"
        :items="[
          { label: 'Оплата роялти', value: 'royalties' },
          { label: 'Пополнение', value: 'replenishment' },
          { label: 'Другое', value: 'other' },
        ]"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Сумма, руб"
      name="total"
      required
    >
      <UInputNumber
        v-model="state.total"
        orientation="vertical"
        :step="0.1"
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
import type { CreatePartnerInvoice } from '#shared/services/partner'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createPartnerInvoiceSchema } from '#shared/services/partner'

const { partnerId } = defineProps<{ partnerId?: string }>()
const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()

const state = ref<Partial<CreatePartnerInvoice>>({
  title: undefined,
  description: undefined,
  total: 0,
  type: 'royalties',
  status: 'unpaid',
})

async function onSubmit(event: FormSubmitEvent<CreatePartnerInvoice>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/id/${partnerId}/invoice`, {
      method: 'POST',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.invoice-created'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
