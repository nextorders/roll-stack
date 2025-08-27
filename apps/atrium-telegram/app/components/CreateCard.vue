<template>
  <div class="flex flex-col gap-4 justify-center items-center h-full min-h-40 border-2 border-default border-dashed rounded-lg">
    <UIcon :name="icon" class="size-10 text-muted/50" />

    <UButton
      size="md"
      variant="solid"
      color="secondary"
      :label="label"
      :ui="{
        base: 'px-3 rounded-full',
        label: 'font-medium',
      }"
      @click="vibrate"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string, icon: string }>()

const { vibrate } = useFeedback()
</script>
