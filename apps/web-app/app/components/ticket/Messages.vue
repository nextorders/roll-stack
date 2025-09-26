<template>
  <div ref="block" class="flex-1 py-4 sm:p-6 overflow-y-auto scroll-pt-8">
    <div class="w-full mx-auto px-2 sm:px-6 lg:px-8 max-w-xl">
      <div class="w-full flex flex-col gap-2 flex-1 px-2.5 last-of-type:mb-20">
        <div
          v-for="message in ticket?.messages"
          :id="message.id"
          :key="message.id"
        >
          <TicketMessage
            :message="message"
            :side="userStore.id === message.userId ? 'right' : 'left'"
            :is-first-message-of-day="messagesWithIsFirstMessageOfDay.some((item) => item.id === message.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { id } = defineProps<{ id: string }>()

const route = useRoute()
const targetId = route.query['target-id']

const userStore = useUserStore()
const ticketStore = useTicketStore()

const ticket = computed(() => ticketStore.find(id))

// show is-first-message-of-day if it's first message of day
const messagesWithIsFirstMessageOfDay = ref<{ id: string, isFirstMessageOfDay: boolean }[]>([])
const lastDay = ref<number>()

function recalculate() {
  if (!ticket.value?.messages.length) {
    return
  }

  targetMessageId.value = targetId as string // ?? ticket.value.messages[ticket.value?.messages.length - 1]?.id
  scrollToMessage()

  messagesWithIsFirstMessageOfDay.value = []

  for (const message of ticket.value.messages) {
    const day = new Date(message.createdAt).getDate()
    if (lastDay.value !== day) {
      lastDay.value = day
      messagesWithIsFirstMessageOfDay.value.push({ id: message.id, isFirstMessageOfDay: true })
    }
  }
}

const targetMessageId = ref<string | undefined>()
const block = useTemplateRef<HTMLDivElement>('block')

const { arrivedState } = useScroll(block, { behavior: 'smooth' })

onMounted(() => recalculate())

watch(
  () => ticket.value?.messages.length,
  () => recalculate(),
)

function scrollToMessage() {
  const message = window.document.getElementById(targetMessageId.value ?? 'none')

  if (message) {
    message.scrollIntoView({ behavior: 'smooth' })

    setTimeout(() => {
      if (!arrivedState.bottom) {
        message.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }
}
</script>
