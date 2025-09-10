<template>
  <USelect
    v-model="value"
    color="neutral"
    variant="outline"
    size="lg"
    :items="items"
    :icon="icon"
    :ui="{
      base: 'mx-0 w-fit',
    }"
  />
</template>

<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'

const items = ref([
  {
    label: 'Самовывоз',
    value: 'pickup',
    icon: 'i-lucide-store',
  },
  {
    label: 'Доставка',
    value: 'delivery',
    icon: 'i-lucide-bike',
  },
] satisfies SelectItem[])

const value = ref(items.value[0]?.value)

const icon = computed(() => items.value.find((item) => item.value === value.value)?.icon)
</script>
