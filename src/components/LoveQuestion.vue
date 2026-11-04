<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { burst, burstFromElement, rain } from '../composables/useBurst'
import type { StickerName } from '../stickers'
import { pop } from '../composables/confetti'
import { config } from '../config'
import SectionTitle from './SectionTitle.vue'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ done: [] }>()

const noTexts: { text: string; sticker?: StickerName }[] = [
  { text: 'No' },
  { text: 'Are you sure?' },
  { text: 'Really sure??', sticker: 'pleading' },
  { text: 'Think again!', sticker: 'smirk' },
  { text: 'Pleaseee', sticker: 'heart-hands' },
  { text: "I'll be sad", sticker: 'crying' },
  { text: "You're breaking my heart", sticker: 'broken-heart' },
  { text: 'Nice try, cutie', sticker: 'wink-tongue' },
  { text: 'Wrong button', sticker: 'zany' },
  { text: "I'm gonna cry fr", sticker: 'crying' },
  { text: 'Just press yes', sticker: 'huff' },
]

const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

// little hearts drifting up behind the buttons
const floatHearts = [
  { left: '6%', size: 14, delay: 0, duration: 7, color: '#ffa6bf' },
  { left: '18%', size: 10, delay: 2.5, duration: 8, color: '#c9a8f5' },
  { left: '30%', size: 18, delay: 4.8, duration: 9, color: '#ff85a6' },
  { left: '46%', size: 11, delay: 1.2, duration: 7.5, color: '#ffc8d8' },
  { left: '60%', size: 16, delay: 3.6, duration: 8.5, color: '#f2618a' },
  { left: '72%', size: 12, delay: 0.6, duration: 7, color: '#c9a8f5' },
  { left: '84%', size: 17, delay: 5.4, duration: 9.5, color: '#ffa6bf' },
  { left: '93%', size: 10, delay: 2, duration: 8, color: '#ff85a6' },
]

const arena = ref<HTMLElement | null>(null)
const yesBtn = ref<HTMLElement | null>(null)
const noBtn = ref<HTMLElement | null>(null)
const noCount = ref(0)
const noPos = ref<{ left: number; top: number } | null>(null)
const accepted = ref(false)

const yesScale = computed(() => Math.min(1 + noCount.value * 0.18, 2.4))
// after "Just press yes" it starts over at "Are you sure?", so she can never actually say no
const noText = computed(() => {
  const i = noCount.value === 0 ? 0 : 1 + ((noCount.value - 1) % (noTexts.length - 1))
  return noTexts[i]!
})

async function dodge() {
  noCount.value++
  // measure after the new (longer) text renders so it never overflows the box
  await nextTick()
  if (!arena.value || !noBtn.value || !yesBtn.value) return
  const a = arena.value.getBoundingClientRect()
  const b = noBtn.value.getBoundingClientRect()
  const y = yesBtn.value.getBoundingClientRect()
  const pad = 16
  // pick a random spot that doesn't cover the Yes button
  let pos = { left: 0, top: 0 }
  for (let tries = 0; tries < 30; tries++) {
    pos = {
      left: Math.random() * Math.max(0, a.width - b.width),
      top: Math.random() * Math.max(0, a.height - b.height),
    }
    const x0 = a.left + pos.left
    const y0 = a.top + pos.top
    const overlaps =
      x0 < y.right + pad && x0 + b.width > y.left - pad && y0 < y.bottom + pad && y0 + b.height > y.top - pad
    if (!overlaps) break
  }
  noPos.value = pos
  burstFromElement(noBtn.value, { count: 4, stickers: ['wink-tongue', 'dash', 'monkey'], spread: 60 })
}

function sayYes() {
  accepted.value = true
  emit('done')
  rain()
  pop(0.5, 0.6)
  burst(window.innerWidth / 2, window.innerHeight / 2, { count: 36, spread: 280 })
}
</script>

<template>
  <div>
    <SectionTitle :eyebrow="`one last thing, ${config.names.question}…`" title="Do you love me?">
      <AnimatedSticker name="pleading" size="4rem" />
    </SectionTitle>

    <div class="love-box pop-in relative mx-auto max-w-xl overflow-hidden rounded-[1.75rem] p-4 [animation-delay:150ms] sm:p-6">
      <span class="pointer-events-none absolute inset-0" aria-hidden="true">
        <svg
          v-for="h in floatHearts"
          :key="h.left"
          viewBox="0 0 24 24"
          class="float-heart"
          :style="{ left: h.left, width: `${h.size}px`, height: `${h.size}px`, color: h.color, animationDelay: `${h.delay}s`, animationDuration: `${h.duration}s` }"
        >
          <path :d="HEART" fill="currentColor" />
        </svg>
      </span>
      <Sticker name="bow" size="2.4rem" cut class="animate-wiggle absolute left-3 top-3 -rotate-12" />
      <Sticker name="sparkles" size="1.8rem" class="twinkle absolute bottom-4 right-4" />

      <Transition name="pop" mode="out-in">
        <div v-if="!accepted" key="ask" ref="arena" class="relative h-64">
          <p class="font-hand pointer-events-none absolute inset-x-0 top-0 text-center text-2xl text-blush-400">choose wisely…</p>
          <div class="flex h-full items-center justify-center gap-6">
            <button
              ref="yesBtn"
              type="button"
              class="btn-cute btn-primary yes-btn z-10 origin-center"
              :style="{ transform: `scale(${yesScale})` }"
              @click="sayYes"
            >
              <span class="btn-shine" />
              <span class="relative inline-flex items-center gap-1.5">Yes <Sticker name="pink-heart" size="1.3em" /></span>
            </button>

            <button
              ref="noBtn"
              type="button"
              class="btn-cute btn-soft no-btn whitespace-nowrap !transition-[left,top] !duration-300"
              :style="noPos ? { position: 'absolute', left: `${noPos.left}px`, top: `${noPos.top}px` } : undefined"
              @pointerenter="dodge"
              @click.prevent="dodge"
            >
              <span class="inline-flex items-center gap-1.5">
                {{ noText.text }} <Sticker v-if="noText.sticker" :name="noText.sticker" size="1.3em" />
              </span>
            </button>
          </div>
        </div>

        <div v-else key="yay" class="relative py-6 text-center">
          <div class="flex items-end justify-center">
            <Sticker name="teddy" size="6rem" cut class="animate-float-slow -rotate-6" />
            <AnimatedSticker name="revolving-hearts" size="5rem" class="-ml-3" />
          </div>
          <p class="font-display mt-6 text-4xl font-semibold">Yay!! I knew it!</p>
          <p class="font-hand mt-2 text-3xl text-blush-500">I love you more, always & forever</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* pastel stationery: soft gradient, tiny polka dots and a dashed edge */
.love-box {
  background:
    radial-gradient(rgb(255 255 255 / 0.75) 1.3px, transparent 1.8px) 0 0 / 16px 16px,
    linear-gradient(140deg, #ffe9f0, #fff5f8 45%, #f3ebff);
  border: 2px dashed var(--color-blush-200);
  box-shadow:
    inset 0 0 0 6px rgb(255 255 255 / 0.55),
    0 18px 40px -24px rgb(242 97 138 / 0.5);
}
.float-heart {
  position: absolute;
  bottom: -24px;
  opacity: 0;
  animation: heart-rise linear infinite;
}
.twinkle {
  animation: twinkle 2.4s ease-in-out infinite;
}
/* the Yes button keeps sending out soft pink pulses */
.yes-btn {
  animation:
    gradient-shift 6s ease infinite,
    yes-pulse 1.8s ease-out infinite;
}
.no-btn {
  border-style: dashed;
}

@keyframes heart-rise {
  0% {
    transform: translateY(0) rotate(-10deg);
    opacity: 0;
  }
  15% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-340px) rotate(15deg);
    opacity: 0;
  }
}
@keyframes twinkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(0.75) rotate(15deg);
    opacity: 0.6;
  }
}
@keyframes yes-pulse {
  0% {
    box-shadow:
      0 12px 28px -10px rgb(242 97 138 / 0.65),
      0 0 0 0 rgb(255 133 166 / 0.55);
  }
  100% {
    box-shadow:
      0 12px 28px -10px rgb(242 97 138 / 0.65),
      0 0 0 16px rgb(255 133 166 / 0);
  }
}
</style>
