<template>
  <Content>
    <div class="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-7">
      <UserCard
        v-for="user in partner?.users"
        :key="user.id"
        :user="user"
        @click="modalUpdateUser.open({ userId: user.id })"
      />
    </div>
  </Content>
</template>

<script setup lang="ts">
import { ModalUpdateUser } from '#components'

const { t } = useI18n()
const { params } = useRoute('partner-id')

const partnerStore = usePartnerStore()
const partner = computed(() => partnerStore.partners.find((partner) => partner.id === params.id))

const overlay = useOverlay()
const modalUpdateUser = overlay.create(ModalUpdateUser)

useHead({
  title: t('app.menu.staff'),
})
</script>
