<script setup lang="ts">
import { computed, ref } from 'vue'
import { config } from '../config'
import { celebrate } from '../composables/confetti'
import SectionTitle from './SectionTitle.vue'

const emit = defineEmits<{ done: [] }>()

const reasons = config.reasons
const flipped = ref<Set<number>>(new Set())
const found = computed(() => flipped.value.size)

// a different pastel for every card: [card top, card bottom, seal light, seal mid, seal dark]
const palettes = [
  ['#ffe4ec', '#ffc8d8', '#ff9fbd', '#f2618a', '#d94677'], // strawberry
  ['#f1e9ff', '#dccaf7', '#c9a8f5', '#9b6fe0', '#7a4fc4'], // lavender
  ['#fff2e6', '#ffd9c2', '#ffbf94', '#f28a52', '#d96a33'], // peach
  ['#e6f8f0', '#c3ecd9', '#9ee0c2', '#4fbf8f', '#2f9a6e'], // mint
  ['#e8f3ff', '#c9e2fb', '#a6cdf7', '#5c9ee8', '#3a7cc9'], // sky
  ['#fff8dc', '#ffeaa8', '#ffd97a', '#f2b632', '#cf9417'], // butter
  ['#ffe9f5', '#ffc9e6', '#ffa3d4', '#e85aa8', '#c43d88'], // bubblegum
  ['#ffeceb', '#ffcfcb', '#ffaaa3', '#f06b62', '#cf4b43'], // coral
] as const

function cardColors(i: number) {
  const [top, bottom, light, mid, dark] = palettes[i % palettes.length]!
  return {
    '--top': top,
    '--bottom': bottom,
    '--seal-light': light,
    '--seal': mid,
    '--seal-dark': dark,
  }
}

const HEART =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

const number = (i: number) => String(i + 1).padStart(2, '0')

// longer secrets get a slightly smaller font so they fit on the card;
// sized off the card's width (cqw), so it fits the same on every screen
const textSize = (text: string) =>
  text.length > 130 ? 'text-[11.5cqw]' : text.length > 110 ? 'text-[12cqw]' : text.length > 90 ? 'text-[13cqw]' : 'text-[14.5cqw]'

function flip(i: number) {
  const next = new Set(flipped.value)
  if (next.has(i)) {
    next.delete(i)
  } else {
    next.add(i)
    if (next.size === reasons.length) {
      setTimeout(celebrate, 300)
      // all secrets opened: unlock the next window
      emit('done')
    }
  }
  flipped.value = next
}
</script>

<template>
  <div>
    <SectionTitle :eyebrow="`just a few of them, ${config.names.reasons}`" title="Reasons I love you" subtitle="Tap each card to unlock a little secret" />

    <p class="mb-5 text-center text-sm font-bold text-plum-soft">
      <span class="text-blush-500">{{ found }}</span> / {{ reasons.length }} secrets unlocked
      <span v-if="found === reasons.length"> · and there are a million more</span>
    </p>

    <div class="mx-auto grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <button
        v-for="(text, i) in reasons"
        :key="i"
        :style="{ animationDelay: `${120 + i * 70}ms`, '--i': i, ...cardColors(i) }"
        type="button"
        class="card aspect-[4/5] [perspective:1000px]"
        :class="{ flipped: flipped.has(i) }"
        :aria-pressed="flipped.has(i)"
        :aria-label="`Secret number ${i + 1}`"
        @click="flip(i)"
      >
        <span class="card-inner relative block h-full w-full">
          <!-- sealed front -->
          <span class="card-face card-front grid place-items-center rounded-3xl">
            <span class="flex flex-col items-center">
              <span class="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-plum-soft/80">secret</span>
              <span class="font-display text-2xl font-semibold italic text-plum">No. {{ number(i) }}</span>
              <span class="seal mt-3" :style="{ animationDelay: `${i * -0.2}s` }">
                <svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true"><path :d="HEART" fill="currentColor" /></svg>
              </span>
              <span class="tap mt-3 text-[0.65rem] font-bold uppercase tracking-widest text-plum-soft">tap to open</span>
            </span>
          </span>

          <!-- the secret inside -->
          <!-- label and heart are pinned to the edges, so long secrets never push them out of view -->
          <span class="card-face card-back grid place-items-center rounded-3xl px-2 pb-8 pt-8">
            <span class="absolute inset-x-0 top-3 text-center text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-[var(--seal)]">
              secret no. {{ number(i) }}
            </span>
            <span class="font-hand text-center leading-tight text-plum" :class="textSize(text)">{{ text }}</span>
            <svg viewBox="0 0 24 24" class="back-heart absolute bottom-3 left-1/2 -ml-2 h-4 w-4 text-[var(--seal)]" aria-hidden="true">
              <path :d="HEART" fill="currentColor" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* pops in, then floats gently, each card a little out of step */
.card {
  animation:
    pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
    card-bob 4s ease-in-out infinite;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}
.card:hover {
  transform: translateY(-6px) rotate(-1.5deg);
}
.card:focus-visible {
  outline: 3px solid var(--color-blush-300);
  outline-offset: 4px;
  border-radius: 1.5rem;
}
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.flipped .card-inner {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 12px 26px -14px rgb(242 97 138 / 0.55);
}

/* ---------- sealed front ---------- */

.card-front {
  border: 2px solid rgb(255 255 255 / 0.7);
  background: linear-gradient(135deg, var(--top), var(--bottom));
}
/* tiny polka dots, like pretty stationery */
.card-front::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(255 255 255 / 0.55) 1.2px, transparent 1.6px);
  background-size: 14px 14px;
  pointer-events: none;
}
/* a soft shine sweeping across every few seconds */
.card-front::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgb(255 255 255 / 0.7) 50%, transparent 65%);
  translate: -130% 0;
  animation: shine 5s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.45s);
  pointer-events: none;
}
.card-front > span {
  position: relative;
}
.seal {
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 9999px;
  color: #fff;
  background: radial-gradient(circle at 35% 30%, var(--seal-light), var(--seal) 55%, var(--seal-dark));
  box-shadow:
    inset 0 0 0 3px rgb(255 255 255 / 0.35),
    inset 0 -3px 6px rgb(0 0 0 / 0.12),
    0 8px 16px -6px color-mix(in srgb, var(--seal-dark) 60%, transparent);
  animation: var(--animate-heartbeat);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card:hover .seal {
  transform: rotate(-10deg) scale(1.1);
}
.tap {
  animation: tap-pulse 2s ease-in-out infinite;
}

/* ---------- the secret inside ---------- */

.card-back {
  container-type: inline-size;
  transform: rotateY(180deg);
  border: 2px dashed var(--bottom);
  background:
    repeating-linear-gradient(transparent 0 1.6rem, color-mix(in srgb, var(--seal) 12%, transparent) 1.6rem calc(1.6rem + 1px)),
    linear-gradient(#fffdf9, color-mix(in srgb, var(--top) 60%, #fff));
}
.flipped .back-heart {
  animation: back-heart 0.6s 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

@keyframes card-bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -5px;
  }
}
@keyframes shine {
  0% {
    translate: -130% 0;
  }
  30%,
  100% {
    translate: 130% 0;
  }
}
@keyframes tap-pulse {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}
@keyframes back-heart {
  from {
    opacity: 0;
    transform: scale(0.2);
  }
}
</style>
