<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light'
import { animatedStickerUrl, type AnimatedStickerName } from '../stickers'
import Sticker from './Sticker.vue'

const props = withDefaults(defineProps<{ name: AnimatedStickerName; size?: string; loop?: boolean }>(), {
  size: '4rem',
  loop: true,
})

const container = ref<HTMLElement | null>(null)
// falls back to the still 3D sticker if motion is reduced or the animation can't load
const useStill = ref(false)
let anim: AnimationItem | undefined

onMounted(() => {
  if (!container.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    useStill.value = true
    return
  }
  anim = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: true,
    path: animatedStickerUrl(props.name),
  })
  anim.addEventListener('data_failed', () => (useStill.value = true))
})

onBeforeUnmount(() => anim?.destroy())
</script>

<template>
  <span class="inline-block shrink-0 align-middle" :style="{ width: size, height: size }" aria-hidden="true">
    <Sticker v-if="useStill" :name="name" size="100%" />
    <span v-else ref="container" class="block h-full w-full" />
  </span>
</template>
