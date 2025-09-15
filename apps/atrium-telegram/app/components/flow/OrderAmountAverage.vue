<template>
  <Section class="motion-preset-slide-down motion-delay-400">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-receipt-text" class="size-8 text-primary" />
        <div class="flex flex-row items-end gap-1 font-bold">
          <h3 class="text-2xl/5 font-bold">
            {{ averageToday }}
          </h3>
          <p class="text-lg/4">
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
