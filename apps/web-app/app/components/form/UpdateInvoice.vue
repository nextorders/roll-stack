<template>
  <UForm
    :validate="createValidator(updatePartnerInvoiceSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      label="Статус"
      name="status"
      required
    >
      <USelect
        v-model="state.status"
        :items="[
          { label: 'Не оплачен', value: 'unpaid' },
          { label: 'Полностью оплачен', value: 'paid' },
        ]"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

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
        :items="getInvoiceTypeForSelect()"
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
      :label="$t('common.update')"
    />
  </UForm>
</template>

<script setup lang="ts">
import type { UpdatePartnerInvoice } from '#shared/services/partner'
import type { FormSubmitEvent } from '@nuxt/ui'
import { updatePartnerInvoiceSchema } from '#shared/services/partner'
import { getInvoiceTypeForSelect } from '#shared/utils/helpers'

const { invoiceId } = defineProps<{
  invoiceId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()
const invoices = computed(() => partnerStore.partners.flatMap((partner) => partner.invoices))
const invoice = computed(() => invoices.value.find((invoice) => invoice.id === invoiceId))

const state = ref<Partial<UpdatePartnerInvoice>>({
  title: invoice.value?.title,
  description: invoice.value?.description ?? undefined,
  total: invoice.value?.total,
  type: invoice.value?.type,
  status: invoice.value?.status,
})

async function onSubmit(event: FormSubmitEvent<UpdatePartnerInvoice>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/invoice/id/${invoiceId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.invoice-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
