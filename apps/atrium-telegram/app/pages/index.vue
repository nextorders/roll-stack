<template>
  <PageContainer :back="false" class="flex flex-col gap-y-8">
    <div class="flex flex-col gap-2.5">
      <div class="text-2xl/6 font-bold tracking-tight">
        Команда
      </div>
      <StaffBlock />
    </div>

    <div class="flex flex-col gap-2.5">
      <h1 class="text-2xl/6 font-bold tracking-tight">
        Данные на сегодня
      </h1>
      <div class="grid grid-cols-2 gap-2">
        <FlowKitchensOnline />
        <FlowOrdersOnline />
        <FlowOrderAmountAverage />
        <FlowFeedbackAverage />
      </div>
    </div>

    <div class="flex flex-col gap-2.5">
      <div class="text-2xl/6 font-bold tracking-tight">
        Поток
      </div>
      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="item in flowStore.items"
          :key="item.id"
          :to="`/flow/${item.id}`"
          class="motion-preset-slide-left"
        >
          <FlowItemCard :item="item" />
        </NuxtLink>
      </div>
    </div>

    <div class="mt-16 flex flex-row justify-center">
      <UIcon name="i-lucide-route" class="size-8 text-dimmed/25" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'index',
})

const flowStore = useFlowStore()

useHead({
  title: 'Суши Атриум',
})
</script>
