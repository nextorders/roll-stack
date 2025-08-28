<template>
  <UCard
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
        size="xl"
        required
        autoresize
        placeholder="Напишите свою мысль..."
        :rows="3"
        :disabled="loading"
        class="w-full"
        :ui="{ base: 'p-1' }"
      />

      <div class="flex items-center justify-end gap-2">
        <UButton
          type="submit"
          color="secondary"
          size="md"
          :loading="loading"
          :disabled="!text"
          label="Добавить комментарий"
          icon="i-lucide-send"
          :ui="{
            base: 'px-3 rounded-full',
            label: 'font-medium',
          }"
        />
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
const { epicId } = defineProps<{ epicId: string }>()

const { vibrate } = useFeedback()
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
    vibrate('success')
  } catch (e) {
    console.error(e)
    vibrate('error')
  } finally {
    loading.value = false
  }
}
</script>
