<template>
  <Section>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-users-round" class="size-8 text-primary" />
        <h3 class="text-3xl/5 font-bold">
          {{ averageFeedback }}
        </h3>
      </div>
      <p class="text-sm/4">
        Средняя оценка (не настоящая)
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const averageFeedback = ref(4.1)
</script>
