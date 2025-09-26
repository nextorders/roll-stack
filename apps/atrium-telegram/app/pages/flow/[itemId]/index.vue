<template>
  <PageContainer>
    <Section>
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UAvatar
          v-if="item?.userId"
          :src="userAvatarUrl"
          class="size-10"
        />
        <UIcon
          v-else
          name="i-lucide-clipboard-check"
          class="size-10 text-primary"
        />
      </div>

      <SectionTitle :title="item?.title ?? ''" />

      <div class="w-full text-base/5 whitespace-pre-wrap break-words">
        {{ item?.description }}
      </div>

      <div class="mt-6 flex justify-between items-center">
        <div class="flex flex-row gap-4" />

        <time
          v-if="item?.createdAt"
          :datetime="item.createdAt"
          class="text-sm text-muted"
          v-text="format(new Date(item.createdAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
        />
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
          size="lg"
        />
      </div>
    </Section>

    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row gap-2.5 items-center">
        <SectionTitle title="Комментарии" />
        <UBadge
          v-if="item?.comments.length"
          size="sm"
          color="primary"
          variant="soft"
          class="min-w-6 justify-center"
        >
          {{ item?.comments.length }}
        </UBadge>
      </div>

      <UButton
        variant="solid"
        color="secondary"
        size="xl"
        block
        class="items-center justify-center"
        icon="i-lucide-message-circle"
        label="Написать сообщение"
        @click="vibrate()"
      />

      <div v-if="item?.comments.length" class="w-full flex flex-col gap-3.5 flex-1 last-of-type:mb-20">
        <FlowItemComment
          v-for="comment in item?.comments"
          :key="comment.id"
          :item-id="comment.itemId"
          :comment-id="comment.id"
        />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

definePageMeta({
  name: 'flow-itemId',
  canReturn: true,
})

const { params } = useRoute('flow-itemId')
const { vibrate } = useFeedback()

const userStore = useUserStore()
const flowStore = useFlowStore()
const item = computed(() => flowStore.items.find((item) => item.id === params.itemId))
const userAvatarUrl = computed(() => userStore.users.find((user) => user.id === item.value?.userId)?.avatarUrl ?? undefined)

const isViewed = computed(() => item.value?.views.some((view) => view.userId === userStore?.id))

watch(isViewed, () => {
  if (!isViewed.value && item.value?.id) {
    flowStore.addView(item.value.id)
  }
}, { immediate: true })
</script>
