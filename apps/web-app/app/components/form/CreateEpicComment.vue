<template>
  <div v-if="!userStore.id" class="flex justify-center items-center text-center text-muted">
    <Loader />
  </div>
  <UCard
    v-else
    variant="subtle"
    class="mt-auto bg-elevated/25"
  >
    <form
      class="flex flex-col gap-4"
      @submit.prevent="onCommentSubmit"
    >
      <UTextarea
        v-model="text"
        color="neutral"
        variant="none"
        required
        autoresize
        placeholder="Напишите свою мысль..."
        :rows="3"
        :disabled="loading"
        class="w-full"
        :ui="{ base: 'p-0 resize-none text-base/5' }"
      />

      <div class="flex items-center justify-between gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          size="lg"
          icon="i-lucide-paperclip"
          :loading="loading"
          :disabled="loading"
        />

        <UButton
          type="submit"
          color="secondary"
          size="lg"
          :loading="loading"
          :disabled="!text"
          label="Добавить комментарий"
          icon="i-lucide-send"
        />
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
const { epicId } = defineProps<{ epicId: string }>()

const userStore = useUserStore()
const epicStore = useEpicStore()

const text = ref('')
const loading = ref(false)

async function onCommentSubmit() {
  const trimmed = text.value.trim()
  if (!trimmed) {
    return
  }

  loading.value = true

  try {
    await epicStore.addComment(epicId, trimmed)
    text.value = ''
  } finally {
    loading.value = false
  }
}
</script>
