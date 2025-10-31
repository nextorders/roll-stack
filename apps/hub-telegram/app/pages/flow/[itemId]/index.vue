<template>
  <PageContainer>
    <Section class="motion-preset-slide-left">
      <div class="flex flex-row items-start justify-between gap-2.5">
        <UIcon
          :name="getIconNameForFlowItem(item?.type ?? 'daily_task_report')"
          class="size-10 text-primary"
        />
      </div>

      <iframe
        v-if="item?.iframe"
        :src="item.iframe"
        width="100%"
        height="240"
        style="background-color: #000"
        allow="autoplay; encrypted-media; fullscreen; screen-wake-lock;"
        frameborder="0"
        allowfullscreen
        class="rounded-lg"
      />

      <SectionTitle :title="item?.title ?? ''" />

      <div class="w-full text-base/5 whitespace-pre-wrap wrap-break-word">
        {{ item?.description }}
      </div>

      <div class="mt-6 flex justify-between items-center">
        <div class="flex flex-row gap-4">
          <div class="flex flex-row gap-1 items-center text-sm text-muted">
            <UIcon name="i-lucide-eye" class="size-4" />
            {{ item?.views.length }}
          </div>
        </div>

        <time
          v-if="item?.createdAt"
          :datetime="item.createdAt"
          class="text-sm text-muted"
          v-text="format(new Date(item.createdAt), 'd MMMM yyyy в HH:mm', { locale: ru })"
        />
      </div>
    </Section>

    <div class="flex flex-col gap-2.5">
      <div class="flex flex-row gap-2.5 items-center">
        <SectionTitle title="Комментарии" />
        <CounterBadge :value="item?.comments.length" />
      </div>

      <UDrawer v-model:open="isDrawerOpened">
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

        <template #body>
          <FormCreateFlowItemComment
            :item-id="item?.id ?? ''"
            @submitted="isDrawerOpened = false"
            @success="isDrawerOpened = false"
          />
        </template>
      </UDrawer>

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
import { getIconNameForFlowItem } from '#shared/utils/helpers'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

definePageMeta({
  name: 'flow-itemId',
  canReturn: true,
})

const { params } = useRoute('flow-itemId')
const { vibrate } = useFeedback()

const isDrawerOpened = ref(false)

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
