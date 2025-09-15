<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon name="i-lucide-crown" class="size-10 text-primary" />

        <UButton
          variant="soft"
          color="primary"
          size="md"
          icon="i-lucide-pencil"
          @click="handleEditEpic"
        />
      </div>

      <h1 class="text-2xl/6 font-bold">
        {{ epic?.title }}
      </h1>

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ epic?.description }}
      </div>
    </Section>

    <Section class="flex flex-row justify-between items-center">
      <div v-if="epic?.comments && epic?.comments.length >= 0" class="flex flex-row items-center gap-2">
        <UIcon name="i-lucide-message-circle" class="size-5" />
        {{ epic.comments.length }} {{ pluralizationRu(epic.comments.length, ['комментарий', 'комментария', 'комментариев']) }}
      </div>
    </Section>

    <div class="w-full flex flex-col gap-3.5 flex-1 last-of-type:mb-20">
      <EpicComment
        v-for="comment in epic?.comments"
        :key="comment.id"
        :epic-id="comment.epicId"
        :comment-id="comment.id"
      />
    </div>

    <UDrawer v-model:open="isDrawerOpened">
      <CreateCard
        v-if="epic?.id"
        :label="$t('app.create.epic-comment.button')"
        icon="i-lucide-message-circle"
      />

      <template #body>
        <FormCreateEpicComment
          :epic-id="epic?.id ?? ''"
          @submitted="isDrawerOpened = false"
          @success="isDrawerOpened = false"
        />
      </template>
    </UDrawer>
  </PageContainer>
</template>

<script setup lang="ts">
import { ModalUpdateEpic } from '#components'

definePageMeta({
  name: 'epic-epicId',
  canReturn: true,
})

const { params } = useRoute('epic-epicId')

const { vibrate } = useFeedback()
const epicStore = useEpicStore()
const epic = computed(() => epicStore.epics.find((e) => e.id === params.epicId))

const isDrawerOpened = ref(false)

const overlay = useOverlay()
const modalUpdateEpic = overlay.create(ModalUpdateEpic)

function handleEditEpic() {
  if (!epic.value?.id) {
    return
  }

  vibrate()
  modalUpdateEpic.open({ epicId: epic.value.id })
}
</script>
