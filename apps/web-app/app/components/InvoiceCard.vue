<template>
  <UCard class="group/list">
    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between">
        <UIcon name="i-lucide-banknote-arrow-up" class="size-10 text-muted/50" />

        <UButton
          variant="outline"
          color="neutral"
          size="md"
          icon="i-lucide-pencil"
          class="size-10 justify-center opacity-0 group-hover/list:opacity-100 transition duration-200"
          @click="modalUpdateInvoice.open({ invoiceId: invoice.id })"
        />
      </div>

      <div class="text-sm/4 text-muted">
        Создан {{ format(new Date(invoice.createdAt), 'd MMMM в HH:mm', { locale: ru }) }}
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ new Intl.NumberFormat().format(invoice.total) }} ₽
      </h3>

      <p class="text-base/5">
        {{ invoice.title }}
      </p>

      <p v-if="invoice.description" class="text-sm/4 text-muted">
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
          :color="invoice.status === 'unpaid' ? 'error' : 'neutral'"
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
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

defineProps<{
  invoice: Invoice
}>()

function getInfoByType(type: Invoice['type']) {
  switch (type) {
    case 'replenishment':
      return 'Пополнение'
    case 'royalties':
      return 'Роялти'
    case 'lump_sum_fee':
      return 'Паушальный взнос'
    case 'marketing_fee':
      return 'Маркетинговый сбор'
    case 'rospatent_fee':
      return 'Роспатент'
    case 'other':
      return 'Другое'
    default:
      return 'Другое'
  }
}

function getInfoByStatus(status: Invoice['status']) {
  switch (status) {
    case 'unpaid':
      return 'Не оплачен'
    case 'paid':
      return 'Оплачен'
    default:
      return 'Неизвестно'
  }
}

const overlay = useOverlay()
const modalUpdateInvoice = overlay.create(ModalUpdateInvoice)
</script>
