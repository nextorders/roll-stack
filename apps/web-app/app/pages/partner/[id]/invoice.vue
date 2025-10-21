<template>
  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <PartnerBalanceCard :balance="partner?.balance ?? 0" />

      <InvoiceCard
        v-for="invoice in invoices"
        :key="invoice.id"
        :invoice="invoice"
      />

      <div>
        <CreateCard
          label="Добавить новый счет"
          icon="i-lucide-scroll-text"
          @click="modalCreateInvoice.open({ partnerId: partner?.id })"
        />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import { ModalCreateInvoice } from '#components'

const { t } = useI18n()
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))
const invoices = computed(() => partner.value?.invoices.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

const overlay = useOverlay()
const modalCreateInvoice = overlay.create(ModalCreateInvoice)

useHead({
  title: t('app.menu.invoices'),
})
</script>
