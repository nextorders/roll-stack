<template>
  <UCard class="group/list">
    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between">
        <UIcon name="i-lucide-banknote-arrow-up" class="size-14 text-primary" />

        <UButton
          variant="outline"
          color="neutral"
          size="md"
          icon="i-lucide-pencil"
          class="size-10 justify-center opacity-0 group-hover/list:opacity-100 transition duration-200"
          @click="modalUpdateInvoice.open({ invoiceId: invoice.id })"
        />
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ new Intl.NumberFormat().format(invoice.total) }} ₽
      </h3>

      <p class="text-base/5">
        {{ invoice.title }}
      </p>

      <p class="text-sm/4 text-muted">
        {{ invoice.description }}
      </p>

      <div class="flex flex-row flex-wrap gap-2">
        <UBadge
          :label="getInfoByType(invoice.type)"
          color="neutral"
          size="md"
          variant="soft"
        />

        <UBadge
          :label="getInfoByStatus(invoice.status)"
          :color="invoice.status === 'unpaid' ? 'error' : 'success'"
          size="md"
          variant="soft"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Invoice } from '@roll-stack/database'
import { ModalUpdateInvoice } from '#components'

defineProps<{
  invoice: Invoice
}>()

function getInfoByType(type: Invoice['type']) {
  switch (type) {
    case 'replenishment':
      return 'Пополнение'
    case 'royalties':
      return 'Роялти'
    case 'other':
      return 'Другое'
  }
}

function getInfoByStatus(status: Invoice['status']) {
  switch (status) {
    case 'unpaid':
      return 'Не оплачен'
    case 'paid':
      return 'Оплачен'
  }
}

const overlay = useOverlay()
const modalUpdateInvoice = overlay.create(ModalUpdateInvoice)
</script>
