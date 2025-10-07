<template>
  <PageContainer>
    <SectionTitle :title="`Договор № ${agreement?.internalId}`" />

    <PartnerAgreementCard v-if="agreement" :agreement="agreement" />
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'agreement-agreementId',
  canReturn: true,
})

const { params } = useRoute('agreement-agreementId')

const partnerStore = usePartnerStore()
const agreement = computed(() => partnerStore.agreements.find((agreement) => agreement.id === params.agreementId))
</script>
