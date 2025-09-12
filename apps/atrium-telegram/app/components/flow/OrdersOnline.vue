<template>
  <Section>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-receipt-text" class="size-8 text-primary" />
        <h3 class="text-3xl/5 font-bold">
          {{ kitchenStore.todayData?.ordersForNow }}
        </h3>
      </div>
      <p class="text-sm/4">
        {{ pluralizationRu(kitchenStore.todayData?.ordersForNow ?? 0, ['Заказ', 'Заказа', 'Заказов']) }} (примерно)
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const kitchenStore = useKitchenStore()
</script>
