<template>
  <Section class="motion-preset-slide-down motion-delay-400">
    <div class="flex flex-col gap-2">
      <UIcon name="i-lucide-calendar-check-2" class="size-8 text-primary" />
      <p class="text-base/5">
        Вы с нами уже <span class="font-bold">{{ days }} {{ pluralizationRu(days, ['день', 'дня', 'дней']) }}</span>
      </p>
    </div>
  </Section>
</template>

<script setup lang="ts">
const { createdAt } = defineProps<{ createdAt: string }>()

const date = computed(() => new Date(createdAt))
const days = computed(() => Math.floor((Date.now() - date.value.getTime()) / 86400000))
</script>
