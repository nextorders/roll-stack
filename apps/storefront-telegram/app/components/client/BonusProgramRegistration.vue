<template>
  <ClientPointsCardBottomBlock>
    <div>
      <h3 class="font-semibold">
        Активируйте ваши бонусные баллы!
      </h3>
      <p class="text-sm/4">
        Чтобы начать пользоваться программой лояльности и получать
        выгоду от накопленных баллов, необходимо завершить регистрацию
      </p>
    </div>

    <UButton
      color="primary"
      block
      size="lg"
      label="Активировать"
      @click="handleClick"
    />
  </ClientPointsCardBottomBlock>

  <UDrawer
    v-model:open="isDrawerOpened"
    should-scale-background
    :set-background-color-on-scale="false"
  >
    <template #content>
      <div class="p-4 pb-20 flex flex-col gap-5 overflow-y-auto">
        <h2 class="text-xl/6 font-semibold">
          Регистрация в программе лояльности
        </h2>

        <div class="flex flex-row gap-2 items-start text-base/5">
          <UIcon name="fluent:heart-circle-24-filled" class="shrink-0 size-6 text-primary" />
          <p>
            Кешбэк определяется по сумме заказов за все время. Максимальный — 15% от суммы заказа.
            Бонусные баллы автоматически сгорают через 180 дней при отсутствии активности.
          </p>
        </div>

        <div class="flex flex-row gap-2 items-start text-base/5">
          <UIcon name="i-lucide-at-sign" class="shrink-0 size-6 text-primary" />
          <p>
            На указанный почтовый адрес будем отправлять онлайн чеки.
          </p>
        </div>

        <div class="flex flex-row gap-2 items-start text-base/5">
          <UIcon name="i-lucide-cake" class="shrink-0 size-6 text-primary" />
          <p>
            К дню рождения будем присылать вкусные подарки.
          </p>
        </div>

        <FormCompleteBonusProgramRegistration
          @submitted="handleClose()"
        />

        <p class="text-sm">
          Передавая данные, вы соглашаетесь с
          <ULink to="https://sushi-love.ru" target="_blank">
            условиями программы лояльности,
          </ULink>
          <ULink to="https://sushi-love.ru" target="_blank">
            политикой конфиденциальности
          </ULink> и <ULink to="https://sushi-love.ru" target="_blank">
            условиями обработки персональных данных.
          </ULink>
        </p>
      </div>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
const { vibrate } = useFeedback()

const isDrawerOpened = ref(false)

function handleClick() {
  vibrate()
  isDrawerOpened.value = !isDrawerOpened.value
}

function handleClose() {
  isDrawerOpened.value = false
}
</script>
