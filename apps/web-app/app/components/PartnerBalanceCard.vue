<template>
  <UCard>
    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row items-start gap-2.5">
        <UIcon name="i-lucide-banknote" class="size-14 text-primary" />
      </div>

      <h3 class="text-xl md:text-xl/6 font-semibold">
        Баланс {{ new Intl.NumberFormat().format(balance) }} ₽
      </h3>

      <p class="text-base/5">
        Может уходить в минус, если партнер не будет оплачивать выставленные ему счета.
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  balance: number
}>()
</script>
