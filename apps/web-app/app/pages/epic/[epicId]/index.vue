<template>
  <Header :title="t('app.menu.epic')" />

  <Content>
    <div class="md:mx-auto md:w-lg flex flex-col gap-5">
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-crown" class="size-14 text-primary" />

        <UTooltip v-if="epic?.id" :text="`Редактировать «${epic?.title}»`">
          <UButton
            variant="outline"
            color="neutral"
            size="md"
            icon="i-lucide-pencil"
            class="size-10 justify-center"
            @click="modalUpdateEpic.open({ epicId: epic.id })"
          />
        </UTooltip>
      </div>

      <h2 class="text-xl md:text-3xl font-bold">
        {{ epic?.title }}
      </h2>

      <div class="w-full text-lg leading-6 whitespace-pre-wrap break-words">
        {{ epic?.description }}
      </div>

      <div class="mt-8 flex flex-row justify-between items-center">
        <div v-if="epic?.comments && epic?.comments.length >= 0" class="text-muted">
          {{ epic.comments.length }} {{ pluralizationRu(epic.comments.length, ['комментарий', 'комментария', 'комментариев']) }}
        </div>
      </div>

      <div class="w-full flex flex-col gap-2 flex-1 last-of-type:mb-20">
        <EpicComment
          v-for="comment in epic?.comments"
          :key="comment.id"
          :epic-id="epic?.id ?? ''"
          :comment-id="comment.id"
        />
      </div>

      <div class="mb-32">
        <FormCreateEpicComment :epic-id="epic?.id ?? ''" />
      </div>

      <!-- <div class="flex flex-row items-center gap-2">
        <UBadge
          :icon="getCategoryInfo(data?.category ?? '')?.icon"
          size="lg"
          color="neutral"
          variant="outline"
        >
          {{ getCategoryInfo(data?.category ?? '')?.title }}
        </UBadge>

        <UBadge
          icon="i-lucide-calendar-check-2"
          size="lg"
          color="neutral"
          variant="outline"
        >
          {{ data?.date }}
        </UBadge>
      </div> -->
    </div>
  </Content>
</template>

<script setup lang="ts">
import { ModalUpdateEpic } from '#components'

const { t } = useI18n()
const { params } = useRoute('epic-epicId')

const epicStore = useEpicStore()
const epic = computed(() => epicStore.epics.find((e) => e.id === params.epicId))

const overlay = useOverlay()
const modalUpdateEpic = overlay.create(ModalUpdateEpic)

useHead({
  title: epic.value?.title,
})
</script>
