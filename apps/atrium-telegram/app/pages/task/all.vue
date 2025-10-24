<template>
  <PageContainer>
    <div class="flex flex-row gap-2.5 items-center">
      <SectionTitle title="Задачи" />
      <CounterBadge :value="filteredTasks.all.length" />
    </div>

    <div class="grid grid-cols-1 gap-2.5 items-center">
      <USelect
        v-model="sortedBy"
        size="xl"
        trailing-icon="i-lucide-arrow-down-wide-narrow"
        :ui="{
          base: '!ring-0',
        }"
        :items="[
          { label: 'По дате создания (убывание)', value: 'updatedAtDesc' },
          { label: 'По дате создания (возрастание)', value: 'updatedAtAsc' },
        ]"
        class="motion-preset-slide-down"
      />

      <USelect
        v-model="filteredBy"
        size="xl"
        trailing-icon="i-lucide-funnel"
        :ui="{
          base: '!ring-0',
        }"
        :items="[
          { label: 'Все задачи', value: 'all' },
          { label: 'Только выполненные', value: 'completed' },
          { label: 'Только в процессе', value: 'inProgress' },
        ]"
        class="motion-preset-slide-up"
      />

      <USelectMenu
        v-model="selectedPerformer"
        :items="availablePerformers"
        size="xl"
        :ui="{
          base: '!ring-0',
        }"
        placeholder="Все исполнители"
        class="motion-preset-slide-up"
      >
        <template v-if="selectedPerformer?.avatar.src" #trailing>
          <UAvatar
            v-if="selectedPerformer?.avatar"
            :src="selectedPerformer.avatar.src"
            size="xs"
          />
        </template>
      </USelectMenu>
    </div>

    <div class="flex flex-col gap-2.5">
      <div class="flex flex-col gap-4">
        <NuxtLink
          v-for="task in filteredTasks.show"
          :key="task.id"
          :to="`/task/${task.id}`"
          class="motion-preset-slide-left"
        >
          <TaskInfoCard :task="task" />
        </NuxtLink>

        <UButton
          v-if="filteredTasks.canShowMore"
          variant="solid"
          color="secondary"
          size="xl"
          class="mt-6 mx-auto px-8 w-fit items-center justify-center"
          icon="i-lucide-arrow-down"
          :label="$t('common.show-more')"
          @click="handleClickShowMore()"
        />
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import type { Task } from '@roll-stack/database'

const { vibrate } = useFeedback()
const userStore = useUserStore()
const taskStore = useTaskStore()

// On load show last 50 tasks. On button click = show more
const shownTasks = ref(50)

function handleClickShowMore() {
  vibrate('success')
  shownTasks.value += 50
}

const sortedBy = ref<'updatedAtDesc' | 'updatedAtAsc'>('updatedAtDesc')

function sortByUpdatedAtDesc(a: Task, b: Task) {
  const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
  const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
  return bTime - aTime
}

function sortByUpdatedAtAsc(a: Task, b: Task) {
  const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
  const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
  return aTime - bTime
}

function chooseSortFunction() {
  switch (sortedBy.value) {
    case 'updatedAtDesc':
      return sortByUpdatedAtDesc
    case 'updatedAtAsc':
      return sortByUpdatedAtAsc
  }
}

const filteredBy = ref<'all' | 'completed' | 'inProgress'>('all')

function filterByAll() {
  return true
}

function filterByCompleted(task: Task) {
  return task.completedAt
}

function filterByInProgress(task: Task) {
  return !task.completedAt
}

function chooseFilterFunction() {
  switch (filteredBy.value) {
    case 'all':
      return filterByAll
    case 'completed':
      return filterByCompleted
    case 'inProgress':
      return filterByInProgress
  }
}

const availablePerformers = computed(() => [{
  label: 'Все исполнители',
  value: '',
  avatar: {
    src: undefined,
    alt: '',
  },
  onSelect: () => {
    selectedPerformer.value = undefined
  },
}, ...userStore.staff.map((staff) => ({
  label: `${staff.name} ${staff.surname}`,
  value: staff.id,
  avatar: {
    src: staff.avatarUrl ?? undefined,
    alt: '',
  },
}))])

const selectedPerformer = ref<{ label: string, value: string, avatar: { src: string | undefined, alt: string } } | undefined>()

function filterByPerformer(task: Task) {
  return selectedPerformer.value?.value ? task.performerId === selectedPerformer.value.value : true
}

const filteredTasks = computed(() => {
  const sorted = taskStore.tasks.toSorted(chooseSortFunction())
  const filtered = sorted.filter(chooseFilterFunction()).filter(filterByPerformer)

  const show = filtered.slice(0, shownTasks.value)

  return {
    show,
    all: filtered,
    canShowMore: filtered.length > show.length,
  }
})
</script>
