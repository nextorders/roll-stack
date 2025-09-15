<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-clipboard-check" class="size-10 text-primary" />
      </div>

      <h1 class="text-2xl/6 font-bold">
        {{ item?.title }}
      </h1>

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ item?.description }}
      </div>
    </Section>

    <Section class="flex flex-col">
      <h3 class="text-muted">
        Посмотрели
      </h3>

      <div class="flex flex-row gap-2">
        <UAvatar
          v-for="view in item?.views"
          :key="view.id"
          :src="userStore.getAvatarUrl(view.userId)"
        />
      </div>
    </Section>
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'flow-itemId',
  canReturn: true,
})

const { params } = useRoute('flow-itemId')

const userStore = useUserStore()
const flowStore = useFlowStore()
const item = computed(() => flowStore.items.find((item) => item.id === params.itemId))

const isViewed = computed(() => item.value?.views.some((view) => view.userId === userStore?.id))

watch(isViewed, () => {
  if (!isViewed.value && item.value?.id) {
    flowStore.addView(item.value.id)
  }
}, { immediate: true })
</script>
