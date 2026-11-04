<script setup lang="ts">
import { onMounted } from 'vue'
import { config } from '../config'
import { burstFromElement, rain } from '../composables/useBurst'
import { celebrate } from '../composables/confetti'
import type { StickerName } from '../stickers'
import AppButton from './AppButton.vue'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ restart: [] }>()

const stickers: StickerName[] = ['bow', 'teddy', 'tulip', 'shortcake', 'butterfly', 'love-letter']

function love(e: MouseEvent) {
  burstFromElement(e.currentTarget as Element, { count: 22, spread: 190 })
}

onMounted(() => {
  celebrate()
  setTimeout(() => rain({ count: 50 }), 500)
})
</script>

<template>
  <div class="py-4 text-center">
    <button
      type="button"
      class="pop-in transition hover:scale-110"
      aria-label="Send love"
      @click="love"
    >
      <AnimatedSticker name="sparkling-heart" size="7rem" />
    </button>

    <h2 class="pop-in font-display mt-4 text-[clamp(2.4rem,8vw,4rem)] font-semibold leading-tight [animation-delay:120ms]">
      Happy Birthday,<br />
      <span class="text-shimmer italic">{{ config.names.final }}</span>
    </h2>

    <p class="pop-in mx-auto mt-5 max-w-md text-plum-soft [animation-delay:240ms]">{{ config.finalMessage }}</p>

    <p class="pop-in font-hand mt-5 text-3xl text-blush-500 [animation-delay:360ms]">love always, {{ config.yourName }} <Sticker name="two-hearts" /></p>

    <div class="mt-6 flex justify-center gap-2 sm:gap-3" aria-hidden="true">
      <span v-for="(s, i) in stickers" :key="s" class="pop-in inline-block" :style="{ animationDelay: `${450 + i * 80}ms` }">
        <span class="animate-float-slow inline-block" :style="{ animationDelay: `${-i * 0.7}s` }">
          <Sticker :name="s" size="clamp(2.4rem, 9vw, 3.25rem)" cut />
        </span>
      </span>
    </div>

    <AppButton variant="soft" class="pop-in mt-8 [animation-delay:600ms]" icon="repeat" @click="emit('restart')">Replay from the start</AppButton>
  </div>
</template>
