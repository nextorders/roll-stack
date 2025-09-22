<template>
  <UCard>
    <div class="flex flex-col gap-3">
      <div class="flex flex-row gap-3 items-center">
        <img
          :src="`https://avatar.nextorders.ru/${review.id}?emotion=${emotion}`"
          width="40"
          height="40"
          alt=""
          class="size-14 rounded-full"
        >
        <div class="flex flex-col gap-0.5">
          <h3 class="text-lg/6 font-semibold">
            {{ review.name }}
          </h3>

          <UButton
            v-if="feedbackPoint?.url"
            :to="feedbackPoint.url"
            target="_blank"
            external
            variant="outline"
            color="neutral"
            size="xs"
            class="w-fit"
            :icon="getFeedbackPointDataByType(feedbackPoint.type)?.icon"
            :ui="{
              leadingIcon: getFeedbackPointDataByType(feedbackPoint.type)?.color,
            }"
            :label="getFeedbackPointDataByType(feedbackPoint.type)?.tooltip"
          />
        </div>
      </div>

      <div class="flex flex-row justify-between">
        <FeedbackRating :rating="Number(review.rating / 2)" class="w-fit" />
        <div class="text-sm text-muted">
          {{ format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ru }) }}
        </div>
      </div>

      <div class="text-base/5 font-medium whitespace-pre-wrap">
        {{ review.text }}
      </div>

      <div v-if="review.url">
        <UButton
          :to="review.url"
          target="_blank"
          external
          variant="outline"
          color="neutral"
          size="sm"
          icon="i-lucide-external-link"
          label="Открыть"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ClientReview } from '@roll-stack/database'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { review } = defineProps<{
  review: ClientReview
}>()

const kitchenStore = useKitchenStore()
const feedbackPoints = computed(() => kitchenStore.kitchens.find((k) => k.id === review.kitchenId)?.feedbackPoints)
const feedbackPoint = computed(() => feedbackPoints.value?.find((p) => p.id === review.feedbackPointId))

const emotion = computed(() => getRandInteger(review.rating === 1 ? 1 : review.rating - 1, review.rating === 10 ? 10 : review.rating + 1))
</script>
