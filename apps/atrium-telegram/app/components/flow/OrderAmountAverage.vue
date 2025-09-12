<template>
  <Section>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-receipt-text" class="size-8 text-primary" />
        <div class="flex flex-row items-end gap-1 font-bold">
          <h3 class="text-3xl/5">
            {{ averageToday }}
          </h3>
          <p class="text-xl/4">
            ₽
          </p>
        </div>
      </div>
      <p class="text-sm/4">
        Средний чек (примерный)
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const averageToday = ref(1635)
</script>
