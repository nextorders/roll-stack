<template>
  <PageContainer :back="false" class="flex flex-col gap-y-8">
    <div class="flex flex-col gap-2.5">
      <img
        :src="userAvatar"
        alt=""
        class="size-16 rounded-full border-3 border-primary"
      >

      <SectionTitle :title="`Привет, ${userStore.name}!`" />

      <ProspectiveBlock />
    </div>

    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row justify-between items-center">
        <SectionTitle :title="$t('app.flow')" />
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
  </PageContainer>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'index',
})

const userStore = useUserStore()
const flowStore = useFlowStore()

const userAvatar = computed(() => userStore.initDataState?.user?.photo_url ?? userStore.avatarUrl ?? '')

useHead({
  title: 'Васаби Хаб',
})
</script>
