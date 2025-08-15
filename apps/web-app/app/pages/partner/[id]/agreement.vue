<template>
  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div
        v-for="agreement in agreements"
        :key="agreement.id"
        class="lg:col-span-2"
      >
        <PartnerAgreementCard :agreement="agreement" />
      </div>

      <div>
        <CreateCard
          label="Добавить новый договор"
          icon="i-lucide-scroll-text"
          @click="modalCreatePartnerAgreement.open({ partnerId: partner?.id, legalEntityId: partner?.legalEntity?.id })"
        />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import { ModalCreatePartnerAgreement } from '#components'

const { t } = useI18n()
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))

const agreements = computed(() => partnerStore.agreements.filter((agreement) => agreement.legalEntityId === partner.value?.legalEntityId))

const overlay = useOverlay()
const modalCreatePartnerAgreement = overlay.create(ModalCreatePartnerAgreement)

useHead({
  title: t('app.partner-agreement.title'),
})
</script>
