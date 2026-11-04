<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; subtitle?: string }>()
</script>

<template>
  <header class="pop-in mx-auto mb-6 max-w-xl text-center">
    <slot />
    <p class="font-hand text-2xl text-blush-500">{{ eyebrow }}</p>
    <h2 class="font-display mt-0.5 text-3xl font-semibold tracking-tight sm:text-4xl">{{ title }}</h2>
    <p v-if="subtitle" class="mt-2 text-sm text-plum-soft">{{ subtitle }}</p>
  </header>
</template>
