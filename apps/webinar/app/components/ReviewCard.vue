<template>
  <UPageCard
    ref="target"
    :ui="{
      description: 'text-lg/6',
    }"
    :class="{ 'motion-preset-slide-up': isVisible }"
  >
    <template #body>
      <div class="flex flex-row gap-4 items-center">
        <UAvatar :src="review.user.avatar.src" class="size-20" />
        <div>
          <h3 class="text-2xl/7 font-semibold text-primary">
            {{ review.user.name }}
          </h3>
          <p>{{ review.user.description }}</p>
        </div>
      </div>

      <div class="mt-4 flex flex-row gap-2">
        <UIcon name="i-lucide-quote" class="shrink-0 size-6 inline-block text-secondary -scale-x-100 -scale-y-100" />
        <p class="text-lg/6 inline">
          {{ review.quote }}
        </p>
        <UIcon name="i-lucide-quote" class="mt-auto shrink-0 size-6 inline-block text-secondary" />
      </div>
    </template>
  </UPageCard>
</template>

<script setup lang="ts">
defineProps<{ review: { user: { name: string, description: string, avatar: { src: string } }, quote: string } }>()

const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target)

const isVisible = ref(false)
watch(targetIsVisible, () => {
  if (!targetIsVisible.value) {
    return
  }

  isVisible.value = targetIsVisible.value
})
</script>
