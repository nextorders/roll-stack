<template>
  <UCard
    variant="subtle"
    class="mt-auto bg-elevated/25"
  >
    <div v-if="!userStore.id" class="text-center text-muted">
      <Loader />
    </div>
    <form
      v-else
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
        :ui="{ base: 'p-0 resize-none text-lg leading-6' }"
      />

      <div class="flex items-center justify-between gap-2">
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
  loading.value = true

  await epicStore.addComment(epicId, text.value)

  text.value = ''
  loading.value = false
}
</script>
