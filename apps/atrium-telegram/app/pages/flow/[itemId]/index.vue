<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-clipboard-check" class="size-10 text-primary" />
      </div>

      <h2 class="text-2xl/6 font-bold">
        {{ item?.title }}
      </h2>

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ item?.description }}
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

const flowStore = useFlowStore()
const item = computed(() => flowStore.items.find((item) => item.id === params.itemId))
</script>
