<script setup lang="ts">
import { stickerUrl, type StickerName } from '../stickers'

const stickers: StickerName[] = [
  'pink-heart', 'cherry-blossom', 'sparkles', 'bow', 'two-hearts', 'butterfly', 'tulip', 'strawberry',
  'cupcake', 'dizzy', 'teddy', 'bubbles', 'shortcake', 'love-letter', 'cloud', 'heart-ribbon',
]

const items = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  sticker: stickers[i % stickers.length]!,
  left: Math.random() * 100,
  size: 22 + Math.random() * 30,
  duration: 16 + Math.random() * 16,
  delay: -Math.random() * 30,
  sway: 20 + Math.random() * 45,
  opacity: 0.35 + Math.random() * 0.4,
}))
</script>

<template>
  <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <div class="blob left-[-10%] top-[-10%] h-[45vmax] w-[45vmax] bg-blush-200" />
    <div class="blob right-[-15%] top-[20%] h-[40vmax] w-[40vmax] bg-lilac [animation-delay:-6s]" />
    <div class="blob bottom-[-15%] left-[20%] h-[42vmax] w-[42vmax] bg-peach [animation-delay:-12s]" />

    <img
      v-for="it in items"
      :key="it.id"
      :src="stickerUrl(it.sticker)"
      alt=""
      class="float-emoji"
      :style="{
        left: `${it.left}%`,
        width: `${it.size}px`,
        height: `${it.size}px`,
        animationDuration: `${it.duration}s`,
        animationDelay: `${it.delay}s`,
        opacity: it.opacity,
        '--sway': `${it.sway}px`,
      }"
    />
  </div>
</template>
