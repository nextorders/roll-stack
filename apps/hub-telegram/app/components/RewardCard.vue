<template>
  <ActiveCard class="motion-preset-slide-left">
    <Section>
      <div class="flex flex-row justify-between">
        <div class="flex flex-col gap-1">
          <h3 class="text-xl/6 font-bold">
            {{ reward.name }}
          </h3>

          <div
            v-if="reward.description"
            class="w-full text-base/5 font-normal whitespace-pre-wrap wrap-break-word line-clamp-8"
          >
            {{ reward.description }}
          </div>
        </div>

        <UButton
          variant="solid"
          color="secondary"
          size="xl"
          class="text-xl/5 font-bold justify-center min-w-24"
          trailing-icon="i-lucide-coins"
          :label="reward.points.toString()"
        />
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { Reward } from '#shared/types'

defineProps<{ reward: Reward }>()
</script>
