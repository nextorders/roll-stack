<template>
  <ActiveCard>
    <Section>
      <div class="flex flex-row gap-2 items-center">
        <UIcon name="i-lucide-store" class="size-8 text-primary" />

        <div v-if="kitchen.partnerId" class="flex flex-row items-center gap-1.5 text-primary">
          <UIcon
            name="i-lucide-bookmark-check"
            class="size-8"
          />
          <p class="max-w-22 text-sm/4 font-bold">
            Активная
          </p>
        </div>
      </div>

      <h3 class="text-xl/5 font-bold">
        {{ kitchen.name }}
      </h3>

      <div class="text-base/5">
        {{ kitchen.address }}, {{ kitchen.city }}
      </div>

      <!-- <div>
        <div v-if="agreement.concludedAt" class="w-full text-base/5 font-normal">
          Заключен: {{ format(new Date(agreement.concludedAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>

        <div v-if="agreement.willEndAt" class="w-full text-base/5 font-normal">
          Заканчивается: {{ format(new Date(agreement.willEndAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>
      </div> -->

      <div v-if="kitchen.description" class="w-full text-base/5 text-muted font-normal whitespace-pre-wrap break-words line-clamp-5">
        {{ kitchen.description }}
      </div>
    </Section>
  </ActiveCard>
</template>

<script setup lang="ts">
import type { Kitchen } from '@roll-stack/database'

defineProps<{
  kitchen: Kitchen
}>()
</script>
