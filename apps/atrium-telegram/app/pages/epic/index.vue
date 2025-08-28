<template>
  <PageContainer>
    <CreateCard
      :label="$t('app.create.epic.button')"
      icon="i-lucide-crown"
      @click="modalCreateEpic.open()"
    />

    <NuxtLink
      v-for="epic of epicStore.epics"
      :key="epic.id"
      :to="`/epic/${epic.id}`"
    >
      <EpicCard :epic="epic" />
    </NuxtLink>

    <div class="mt-16 flex flex-row justify-center">
      <UIcon name="i-lucide-route" class="size-8 text-dimmed/25" />
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { ModalCreateEpic } from '#components'

const epicStore = useEpicStore()

const overlay = useOverlay()
const modalCreateEpic = overlay.create(ModalCreateEpic)
</script>
