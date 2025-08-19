<template>
  <Header :title="t('app.menu.epics')" />

  <Content>
    <UContainer class="mb-20 max-w-lg">
      <div class="mt-12 flex flex-col gap-6">
        <NuxtLink
          v-for="epic of epicStore.epics"
          :key="epic.id"
          :to="`/epic/${epic.id}`"
        >
          <ActiveCard class="w-full flex flex-col gap-5">
            <div class="flex flex-row items-start gap-2.5">
              <UIcon name="i-lucide-crown" class="size-14 text-primary" />
            </div>

            <h3 class="text-xl/5 font-semibold">
              {{ epic.title }}
            </h3>

            <div class="w-full text-base/6 whitespace-pre-wrap break-words">
              {{ epic.description }}
            </div>

            <div class="flex justify-between items-center">
              <div class="flex flex-row gap-4">
                <!-- <div class="flex flex-row gap-1.5 items-center text-muted">
                  <UIcon name="i-lucide-heart" class="size-5" />
                  <p>{{ epic?.comments.length }}</p>
                </div> -->

                <div class="flex flex-row gap-1.5 items-center text-muted">
                  <UIcon name="i-lucide-message-circle" class="size-5" />
                  <p>{{ epic?.comments.length }}</p>
                </div>
              </div>

              <time
                :datetime="epic.createdAt"
                class="text-sm text-muted"
                v-text="format(new Date(epic.createdAt), 'от d MMMM yyyy', { locale: ru })"
              />
            </div>

            <!-- <div class="flex flex-row justify-between items-center">
              <UBadge
                :icon="getCategoryInfo(pin.category)?.icon"
                size="lg"
                color="neutral"
                variant="outline"
              >
                {{ getCategoryInfo(pin.category)?.title }}
              </UBadge>

              <div class="text-sm text-muted">
                {{ pin.date }}
              </div>
            </div> -->
          </ActiveCard>
        </NuxtLink>
      </div>

      <div class="mt-16 flex flex-row justify-center">
        <UIcon name="i-lucide-route" class="size-8 text-dimmed/25" />
      </div>
    </UContainer>
  </Content>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

const { t } = useI18n()

const epicStore = useEpicStore()

useHead({
  title: 'Эпики',
})
</script>
