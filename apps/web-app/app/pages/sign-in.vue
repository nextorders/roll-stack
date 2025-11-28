<template>
  <div class="w-full h-svh mx-auto grid grid-cols-1 lg:grid-cols-2">
    <div class="hidden lg:block bg-secondary">
      <img
        src="/sushi-heart-light.png"
        alt=""
        class="w-2/3 max-w-2xl opacity-15 fixed bottom-16 left-16 motion-preset-pulse motion-duration-4000"
      >
    </div>

    <div class="my-4 flex flex-col justify-between items-center bg-default z-10">
      <div class="grow flex flex-col justify-center items-center">
        <UContainer>
          <h1 class="mb-10 text-2xl md:text-3xl font-bold text-center">
            {{ $t('app.welcome-message') }}
          </h1>

          <div v-if="!isLoaded" class="flex justify-center">
            <Loader />
          </div>
          <div v-else class="mx-auto max-w-[250px]">
            <UForm
              v-if="state.step === 1"
              :schema="signInSchema"
              :state="state"
              class="space-y-4"
              @submit="sendCode"
            >
              <UInput
                v-model="state.phone"
                placeholder="Номер телефона"
                type="tel"
                required
                size="xl"
                maxlength="16"
                class="w-full"
              />

              <UButton
                :disabled="!isPhoneValid"
                :loading="status === 'pending'"
                trailing-icon="i-lucide-arrow-right"
                variant="solid"
                color="primary"
                size="xl"
                class="w-full justify-between"
                label="Получить код"
                type="submit"
              />
            </UForm>

            <form v-if="state.step === 2" class="space-y-4">
              <UPinInput
                v-model="state.code"
                type="number"
                otp
                :length="6"
                required
                size="lg"
                class="w-full justify-center"
              />

              <UButton
                :disabled="!isCodeValid"
                :loading="status === 'pending'"
                trailing-icon="i-lucide-arrow-right"
                variant="solid"
                color="primary"
                size="xl"
                class="w-full justify-between"
                :label="$t('common.sign-in')"
                @click="signIn()"
              />
            </form>
          </div>
        </UContainer>
      </div>

      <ColorModeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { signInSchema } from '#shared/services/common'

definePageMeta({
  layout: 'empty',
  middleware: ['02-guest-only'],
})

const { t } = useI18n()

useHead({
  title: t('app.welcome-message'),
})

const { fetch: refreshSession } = useUserSession()
const user = useUserStore()
const menu = useMenuStore()
const product = useProductStore()
const chat = useChatStore()
const task = useTaskStore()
const notification = useNotificationStore()

const toast = useToast()

const state = ref({
  step: 1,
  phone: '',
  code: [],
})

const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
})

const isPhoneValid = ref(false)
const isCodeValid = computed(() => state.value.code.length === 6)

watch(
  () => state.value.phone,
  () => {
    if (!state.value.phone) {
      return
    }
    if (state.value.phone?.length > 17) {
      return
    }

    // Check for country code
    if (state.value.phone?.length >= 2 && state.value.phone[0] !== '+') {
      // +7
      if (state.value.phone[0] === '7') {
        state.value.phone = `+${state.value.phone}`
      }

      // 8 to +7
      if (state.value.phone[0] === '8') {
        state.value.phone = `+7${state.value.phone.slice(1)}`
      }
    }

    getPhoneNumberFormatter('RU').input(state.value.phone)

    if (state.value.phone?.length >= 10) {
      state.value.phone = formatPhoneNumber(state.value.phone, 'RU')
    }

    isPhoneValid.value = checkPhoneNumberValidity(state.value.phone, 'RU')
  },
)

// Check if code is valid
watch(
  () => state.value.code,
  () => {
    if (isCodeValid.value) {
      signIn()
    }
  },
)

function sendCode() {
  state.value.step = 2
  toast.add({
    title: 'Код отправлен',
    description: 'Введите полученный код. Если код не приходит в течении 60 секунд, перезагрузите страницу и попробуйте снова.',
    duration: 10000,
  })
}

const { status, execute: signIn } = await useFetch('/api/auth/sign-in', {
  method: 'POST',
  body: state,
  immediate: false,
  watch: false,
  onResponse: async ({ response }) => {
    if (response.ok) {
      await refreshSession()

      // Init Stores
      await Promise.all([
        user.update(),
        menu.update(),
        product.update(),
        chat.update(),
        task.update(),
        notification.update(),
      ])

      await navigateTo('/')
    }
  },
  onResponseError: async () => {
    state.value.code = []

    toast.add({
      title: 'Ошибка',
      description: 'Проверьте актуальность введенных данных.',
    })
  },
})
</script>
