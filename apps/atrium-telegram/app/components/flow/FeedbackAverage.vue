<template>
  <Section class="motion-preset-slide-down motion-delay-600">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-users-round" class="size-8 text-primary" />

        <div class="flex flex-row items-end gap-1 font-bold">
          <h3 class="text-2xl/5 font-bold">
            {{ averageFeedback }}
          </h3>
          <p class="text-lg/4">
            из 5
          </p>
        </div>
      </div>
      <p class="text-sm/4">
        Средняя оценка (выдуманная)
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const averageFeedback = ref(4.1)
</script>
