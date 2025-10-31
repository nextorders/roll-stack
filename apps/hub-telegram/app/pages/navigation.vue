<template>
  <PageContainer>
    <div class="flex flex-col gap-2.5 motion-preset-slide-left">
      <NuxtLink
        v-for="item in items"
        :key="item.label"
        :to="item.to"
        :target="item.target"
        @click="item.onClick"
      >
        <ActiveCard>
          <Section>
            <div class="flex flex-row gap-2.5 items-center">
              <UIcon :name="item.icon" class="size-5 shrink-0" />
              <h3 class="text-2xl/6 font-bold">
                {{ item.label }}
              </h3>
            </div>
          </Section>
        </ActiveCard>
      </NuxtLink>
    </div>
  </PageContainer>
</template>

<script lang="ts" setup>
const { vibrate } = useFeedback()

const items = ref([
  {
    label: 'Помощь в WhatsApp',
    to: 'https://wa.me/message/DRMTOEKLZU2FJ1',
    target: '_blank',
    icon: 'i-lucide-heart-handshake',
    onClick: () => vibrate(),
  },
  {
    label: 'Наш Telegram канал',
    to: 'https://t.me/franshizasushi',
    target: '_blank',
    icon: 'simple-icons:telegram',
    onClick: () => vibrate(),
  },
  {
    label: 'Наша VK группа',
    to: 'https://vk.com/franshizasushi',
    target: '_blank',
    icon: 'simple-icons:vk',
    onClick: () => vibrate(),
  },
])
</script>
