<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
      <div class="flex flex-row gap-2 items-center">
        <UIcon
          name="i-lucide-coins"
          class="size-10 text-primary"
        />
      </div>

      <SectionTitle :title="`У вас ${userStore.prospectivePoints} ${pluralizationRu(userStore.prospectivePoints, ['Балл', 'Балла', 'Баллов'])}`" />

      <p class="text-base/5">
        Выбирайте награду! Список регулярно обновляется.
      </p>

      <UButton
        to="/task"
        variant="solid"
        color="secondary"
        size="xl"
        class="text-lg/6 font-bold w-full justify-center"
        label="Хочу еще"
      />
    </Section>

    <div class="flex flex-col gap-3.5">
      <RewardCard
        v-for="reward of rewards"
        :key="reward.id"
        :reward="reward"
      />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { Reward } from '#shared/types'

const userStore = useUserStore()

const rewards = ref<Reward[]>([
  {
    id: '1',
    name: 'Первая награда',
    description: 'Описание награды',
    points: 5,
  },
  {
    id: '2',
    name: 'Вторая награда',
    description: 'Описание награды',
    points: 15,
  },
  {
    id: '3',
    name: 'Третья награда',
    description: 'Описание награды',
    points: 25,
  },
])
</script>
