<template>
  <Section class="motion-preset-slide-down motion-delay-100">
    <div class="flex flex-col gap-2">
      <UIcon name="i-lucide-coins" class="size-8 text-primary" />
      <p class="text-base/5">
        На данный момент у вас <span class="font-bold">{{ points }} {{ pluralizationRu(points, ['Балл', 'Балла', 'Баллов']) }}</span>
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
defineProps<{ points: number }>()
</script>
