<template>
  <ActiveCard>
    <div class="shrink-0 w-full h-full flex flex-col gap-3 items-start justify-start">
      <UIcon name="i-lucide-calendar-fold" class="size-14 text-primary" />

      <h3 class="text-xl md:text-xl/6 font-semibold">
        {{ schedule.title }}
      </h3>

      <h3 class="text-base/5">
        {{ schedule.description }}
      </h3>
    </div>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { ActivitySchedule } from '@roll-stack/database'

defineProps<{ schedule: ActivitySchedule }>()
</script>
