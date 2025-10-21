<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-banknote-arrow-up" class="size-8 text-primary" />

        <div v-if="invoice.status === 'paid'" class="flex flex-row items-center gap-1.5 text-primary">
          <UIcon
            name="i-lucide-bookmark-check"
            class="size-8"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            Оплачено
          </p>
        </div>
        <div v-else class="flex flex-row items-center gap-1.5 text-muted">
          <UIcon
            name="i-lucide-loader-circle"
            class="size-8 motion-preset-spin motion-duration-4000"
          />
        </div>
      </div>

      <h3 class="text-xl/5 font-bold">
        {{ new Intl.NumberFormat().format(invoice.total) }} ₽
      </h3>

      <div class="flex flex-col gap-1">
        <div class="text-base/5">
          {{ invoice.title }}
        </div>

        <div class="text-base/5 text-muted">
          {{ invoice.description }}
        </div>
      </div>

      <div class="text-sm/4 text-muted">
        Создан {{ format(new Date(invoice.createdAt), 'd MMMM в HH:mm', { locale: ru }) }}
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { Invoice } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

defineProps<{
  invoice: Invoice
}>()
</script>
