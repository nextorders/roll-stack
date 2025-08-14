<template>
  <NuxtLink to="/" class="shrink-0 flex items-center gap-1.5 px-3 lg:px-5">
    <img
      src="/sushi-heart.svg"
      alt=""
      class="w-8 duration-200 motion-preset-pulse motion-duration-4000"
    >
    <h2 class="font-bold tracking-tight text-2xl text-highlighted">
      {{ $t('app.title') }}
    </h2>
  </NuxtLink>
</template>
