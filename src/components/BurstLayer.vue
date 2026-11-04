<script setup lang="ts">
import { useParticles } from '../composables/useBurst'
import { stickerUrl } from '../stickers'

const particles = useParticles()
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
    <img
      v-for="p in particles"
      :key="p.id"
      :src="stickerUrl(p.sticker)"
      alt=""
      :class="p.kind === 'burst' ? 'burst-particle' : 'fall-particle'"
      :style="{
        left: `${p.x}px`,
        top: `${p.y}px`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        animationDuration: `${p.duration}ms`,
        animationDelay: `${p.delay}ms`,
        '--dx': `${p.dx}px`,
        '--dy': `${p.dy}px`,
        '--rot': `${p.rot}deg`,
      }"
    />
  </div>
</template>
