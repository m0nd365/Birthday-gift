<script setup lang="ts">
import { ref } from 'vue'
import { config } from '../config'
import { burstFromElement } from '../composables/useBurst'
import { celebrate } from '../composables/confetti'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ open: [] }>()

const opening = ref(false)
const visible = ref(true)

function open(e: MouseEvent) {
  if (opening.value) return
  opening.value = true
  burstFromElement(e.currentTarget as Element, { count: 26, spread: 220 })
  celebrate()
  setTimeout(() => {
    visible.value = false
    emit('open')
  }, 1000)
}
</script>

<template>
  <Transition name="intro">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 grid place-items-center bg-gradient-to-br from-blush-50 via-cream to-[#f6efff] px-6"
    >
      <div class="text-center">
        <AnimatedSticker name="sparkling-heart" size="4.5rem" />
        <p class="font-hand mt-1 text-3xl text-blush-500 sm:text-4xl">psst… {{ config.names.intro }}</p>
        <h1 class="font-display mt-2 text-3xl font-semibold sm:text-4xl">I have something for you</h1>

        <!-- a heads-up to film her reaction before she opens it -->
        <div class="notice mx-auto mt-6 max-w-xs rounded-2xl px-4 py-3">
          <p class="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.25em] text-blush-500">
            <span class="alert" aria-hidden="true">🚨</span> attention <span class="alert" aria-hidden="true">🚨</span>
          </p>
          <p class="mt-1 text-sm leading-snug text-plum">
            Before you open this, could you please record a little video of yourself? I'd really love to see your reaction and how
            you feel as you go through it. <Sticker name="pleading" size="1.1rem" />
          </p>
          <p class="mt-1.5 text-xs leading-snug text-plum-soft">
            But if you don't want to, that's totally okay! <Sticker name="heart-hands" size="1rem" />
          </p>
        </div>

        <button type="button" class="gift mx-auto mt-14" :class="{ opening }" aria-label="Open your gift" @click="open">
          <span class="gift-lid"><Sticker name="bow" size="72px" class="gift-bow" /></span>
          <span class="gift-box" />
        </button>

        <p class="mt-10 animate-pulse text-sm font-bold uppercase tracking-[0.25em] text-plum-soft">tap the gift</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.notice {
  border: 2px dashed var(--color-blush-300);
  background: rgb(255 255 255 / 0.75);
  box-shadow: 0 12px 24px -16px rgb(242 97 138 / 0.6);
  rotate: -1.5deg;
}
/* the alert lights flash to catch her eye */
.alert {
  font-size: 1rem;
  letter-spacing: 0;
  animation: alert-flash 1.2s ease-in-out infinite;
}
@keyframes alert-flash {
  50% {
    opacity: 0.35;
    transform: scale(0.85);
  }
}
.gift {
  position: relative;
  display: block;
  width: 170px;
  height: 160px;
  cursor: pointer;
  animation: wiggle 2.4s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
}
.gift:hover {
  animation-duration: 0.8s;
}
.gift:focus-visible {
  outline: 3px solid var(--color-blush-300);
  outline-offset: 8px;
  border-radius: 20px;
}
.gift-box,
.gift-lid {
  position: absolute;
  left: 50%;
  translate: -50% 0;
  border-radius: 16px;
  /* vertical ribbon */
  background:
    linear-gradient(90deg, transparent 42%, #fff3c4 42%, #fff3c4 58%, transparent 58%),
    linear-gradient(160deg, #ffa6bf, #f2618a);
}
.gift-box {
  bottom: 0;
  width: 146px;
  height: 112px;
  box-shadow: 0 24px 40px -18px rgb(242 97 138 / 0.7);
}
.gift-lid {
  top: 14px;
  z-index: 1;
  width: 170px;
  height: 40px;
  background:
    linear-gradient(90deg, transparent 42%, #fff3c4 42%, #fff3c4 58%, transparent 58%),
    linear-gradient(160deg, #ff85a6, #d94677);
  transition:
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.8s ease;
}
.gift-bow {
  position: absolute;
  left: 50%;
  top: -30px;
  translate: -50% 0;
  filter: drop-shadow(0 4px 6px rgb(217 70 119 / 0.3));
}
.opening {
  animation: none;
}
.opening .gift-lid {
  transform: translateY(-140px) rotate(-28deg);
  opacity: 0;
}
</style>
