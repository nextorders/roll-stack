<template>
  <UForm
    :validate="createValidator(updatePartnerAgreementSchema)"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField
      :label="$t('app.partner-legal-entity.title')"
      name="legalEntityId"
      required
    >
      <USelectMenu
        v-model="selectedLegalEntity"
        :items="legalEntities"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Роялти, %" name="royalty">
      <UInputNumber
        v-model="state.royalty"
        orientation="vertical"
        :step="0.1"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Мин. роялти, руб" name="minRoyaltyPerMonth">
      <UInputNumber
        v-model="state.minRoyaltyPerMonth"
        orientation="vertical"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Маркетинговый сбор, %" name="marketingFee">
      <UInputNumber
        v-model="state.marketingFee"
        orientation="vertical"
        :step="0.1"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Мин. маркетинговый сбор, руб" name="minMarketingFeePerMonth">
      <UInputNumber
        v-model="state.minMarketingFeePerMonth"
        orientation="vertical"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField label="Паушальный взнос, руб" name="lumpSumPayment">
      <UInputNumber
        v-model="state.lumpSumPayment"
        orientation="vertical"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField
      label="Роспатент"
      name="patentStatus"
      required
    >
      <USelectMenu
        v-model="selectedPatentStatus"
        :items="patentStatuses"
        :placeholder="$t('common.select')"
        :content="{
          side: 'top',
        }"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('common.comment')" name="comment">
      <UInput
        v-model="state.comment"
        size="xl"
        placeholder="Для внутреннего использования"
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
import type { UpdatePartnerAgreement } from '#shared/services/partner'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AgreementPatentStatus } from '@roll-stack/database'
import { updatePartnerAgreementSchema } from '#shared/services/partner'
import { getPatentStatusForSelect } from '#shared/utils/helpers'

const { agreementId } = defineProps<{
  agreementId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const actionToast = useActionToast()

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.legalEntity?.agreements.some((agreement) => agreement.id === agreementId)))
const agreement = computed(() => partner.value?.legalEntity?.agreements.find((agreement) => agreement.id === agreementId))

const state = ref<Partial<UpdatePartnerAgreement>>({
  royalty: agreement.value?.royalty,
  minRoyaltyPerMonth: agreement.value?.minRoyaltyPerMonth,
  marketingFee: agreement.value?.marketingFee,
  minMarketingFeePerMonth: agreement.value?.minMarketingFeePerMonth,
  lumpSumPayment: agreement.value?.lumpSumPayment,
  comment: agreement.value?.comment ?? undefined,
  legalEntityId: agreement.value?.legalEntityId ?? undefined,
  patentStatus: agreement.value?.patentStatus,
})

const legalEntities = computed(() => partnerStore.legalEntities.map((legalEntity) => {
  return {
    label: legalEntity.name,
    value: legalEntity.id,
  }
}))

const selectedLegalEntity = ref(legalEntities.value.find((legalEntity) => legalEntity.value === agreement.value?.legalEntityId))

watch(selectedLegalEntity, (newValue) => {
  state.value.legalEntityId = newValue?.value
})

const patentStatuses = computed(() => getPatentStatusForSelect())

type PatentStatusSelectedValue = { value: AgreementPatentStatus, label: string }

const selectedPatentStatus = ref<PatentStatusSelectedValue>(
  patentStatuses.value.find((s) => s.value === agreement.value?.patentStatus) ?? getPatentStatusForSelect()[0] as PatentStatusSelectedValue,
)

watch(selectedPatentStatus, (newValue) => {
  state.value.patentStatus = newValue?.value
})

async function onSubmit(event: FormSubmitEvent<UpdatePartnerAgreement>) {
  const toastId = actionToast.start()
  emit('submitted')

  try {
    await $fetch(`/api/partner/agreement/id/${agreementId}`, {
      method: 'PATCH',
      body: event.data,
    })

    await partnerStore.update()

    actionToast.success(toastId, t('toast.partner-agreement-updated'))
    emit('success')
  } catch (error) {
    console.error(error)
    actionToast.error(toastId)
  }
}
</script>
