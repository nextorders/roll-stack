<template>
  <UPageSection
    title="Отзывы"
    orientation="vertical"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ReviewCard
        v-for="review in reviews"
        :key="review.user.name"
        :review="review"
      />
    </div>
  </UPageSection>
</template>

<script setup lang="ts">
const reviews = ref([{
  user: {
    name: 'Сергей',
    description: 'Одинцово',
    avatar: {
      src: 'https://avatar.nextorders.ru/637024?emotion=8&gender=male&clothing=teal',
      alt: '',
    },
  },
  quote: 'Открыл суши-бар в августе 2025 года. На открытие ушел 1 месяц. В первый день выручка составила 70 тыс. руб. Считаю это неплохим показателем, учитывая, что один из поваров попал в аварию и мы вынуждены были справляться сами. Иначе выручки были бы еще больше.',
}, {
  user: {
    name: 'Надежда',
    description: 'Зеленоградск',
    avatar: {
      src: 'https://avatar.nextorders.ru/219743?emotion=7&gender=female&clothing=violet',
      alt: '',
    },
  },
  quote: 'На открытие своего кафе в курортном городе у меня ушло 2 месяца. Мое кафе работает уже пару лет и приносит мне 3 млн.руб выручки в год. Треть из них моя чистая прибыль.',
}, {
  user: {
    name: 'Екатерина',
    description: 'Гурьевск',
    avatar: {
      src: 'https://avatar.nextorders.ru/108633?emotion=9&gender=female&clothing=green',
      alt: '',
    },
  },
  quote: 'Я открыла свое заведение более 10 лет назад, которое работает и по сей день, принося, стабильный доход. Все бизнес процессы отточены, а управлению я уделяю не более 2-х часов в неделю.',
}])
</script>
