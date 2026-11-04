<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Component } from 'vue'
import { burst, burstFromElement, SPARKLES } from './composables/useBurst'
import BackgroundDecor from './components/BackgroundDecor.vue'
import BurstLayer from './components/BurstLayer.vue'
import IntroGift from './components/IntroGift.vue'
import AppButton from './components/AppButton.vue'
import WelcomeStep from './components/WelcomeStep.vue'
import LoveLetter from './components/LoveLetter.vue'
import FutureMemories from './components/FutureMemories.vue'
import ReasonsCards from './components/ReasonsCards.vue'
import BirthdayCake from './components/BirthdayCake.vue'
import LoveQuestion from './components/LoveQuestion.vue'
import FinalStep from './components/FinalStep.vue'
import Sticker from './components/Sticker.vue'
import type { StickerName } from './stickers'

interface Step {
  title: string
  sticker: StickerName
  component: Component
  /** button that goes to the next pop-up */
  next?: { label: string; sticker: StickerName }
  /** if set, the next button stays hidden until the step emits `done` */
  lock?: string
  /** keep the window at a fixed height (for content that grows, like the chat) so it never re-centers mid-animation */
  fixedHeight?: boolean
}

const steps: Step[] = [
  {
    title: 'hi birthday girl',
    sticker: 'bow',
    component: WelcomeStep,
    next: { label: 'Open my letter', sticker: 'love-letter' },
    lock: 'reply to my message first',
    fixedHeight: true,
  },
  {
    title: 'a little letter',
    sticker: 'love-letter',
    component: LoveLetter,
    next: { label: 'Our memories', sticker: 'camera' },
    lock: 'read the whole letter first',
  },
  { title: 'our future memories', sticker: 'camera', component: FutureMemories, next: { label: 'Why I love you', sticker: 'heart-ribbon' } },
  { title: 'reasons i love you', sticker: 'heart-ribbon', component: ReasonsCards, next: { label: 'Time for cake', sticker: 'cake' } },
  {
    title: 'make a wish',
    sticker: 'candle',
    component: BirthdayCake,
    next: { label: 'One last thing', sticker: 'pleading' },
    lock: 'blow out all the candles first',
  },
  {
    title: 'one last question',
    sticker: 'pleading',
    component: LoveQuestion,
    next: { label: 'Your last surprise', sticker: 'gift' },
    lock: 'answer the question first',
  },
  { title: 'forever & always', sticker: 'sparkling-heart', component: FinalStep },
]

/** -1 = still on the gift intro */
const index = ref(-1)
const unlocked = ref<Set<number>>(new Set())
const current = computed(() => steps[index.value])
const canNext = computed(() => !current.value?.lock || unlocked.value.has(index.value))

function unlock() {
  unlocked.value = new Set(unlocked.value).add(index.value)
}
function next() {
  if (index.value < steps.length - 1) index.value++
}
function back() {
  if (index.value > 0) index.value--
}
function restart() {
  unlocked.value = new Set()
  index.value = 0
}

// the ✕ button refuses to close
const teases: { text: string; sticker: StickerName }[] = [
  { text: "nope, you're stuck with me", sticker: 'huff' },
  { text: "you can't close my love", sticker: 'sparkling-heart' },
  { text: 'nice try', sticker: 'smirk' },
  { text: 'no escaping today', sticker: 'bow' },
]
const tease = ref<(typeof teases)[number] | null>(null)
const shaking = ref(false)
let teaseTimer: number | undefined
function noClose(e: MouseEvent) {
  burstFromElement(e.currentTarget as Element, { count: 10, spread: 90 })
  tease.value = teases[Math.floor(Math.random() * teases.length)] ?? null
  shaking.value = true
  clearTimeout(teaseTimer)
  setTimeout(() => (shaking.value = false), 500)
  teaseTimer = window.setTimeout(() => (tease.value = null), 1800)
}

// a tiny sparkle wherever she taps (buttons do their own bigger burst)
function sparkle(e: PointerEvent) {
  if ((e.target as Element | null)?.closest('button, a')) return
  burst(e.clientX, e.clientY, { count: 5, stickers: SPARKLES, spread: 60 })
}
onMounted(() => window.addEventListener('pointerdown', sparkle))
onUnmounted(() => window.removeEventListener('pointerdown', sparkle))
</script>

<template>
  <BackgroundDecor />
  <BurstLayer />
  <IntroGift @open="index = 0" />

  <div v-if="current" class="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6">
    <Transition name="window" mode="out-in" appear>
      <div
        :key="index"
        class="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border-2 border-white bg-white/75 shadow-2xl shadow-blush-300/40 backdrop-blur-xl"
        :class="{ 'animate-shake': shaking, 'h-full sm:max-h-[48rem]': current.fixedHeight }"
        role="dialog"
        :aria-label="current.title"
      >
        <!-- title bar -->
        <div class="flex items-center gap-3 border-b border-blush-100 bg-gradient-to-r from-blush-100 via-[#fbefff] to-[#fff0e6] px-4 py-2.5">
          <div class="flex gap-1.5" aria-hidden="true">
            <span class="h-3 w-3 rounded-full bg-blush-400" />
            <span class="h-3 w-3 rounded-full bg-[#ffd166]" />
            <span class="h-3 w-3 rounded-full bg-[#c58cf0]" />
          </div>
          <p class="font-hand flex flex-1 items-center justify-center gap-1.5 truncate text-xl font-bold leading-none text-blush-500">
            {{ current.title }} <Sticker :name="current.sticker" size="1.35rem" />
          </p>
          <button
            type="button"
            class="grid h-7 w-7 place-items-center rounded-full text-sm font-black text-plum-soft transition hover:rotate-90 hover:bg-white hover:text-blush-500"
            aria-label="Close (it won't work)"
            @click="noClose"
          >
            ✕
          </button>
          <Transition name="pop">
            <span
              v-if="tease"
              class="absolute right-3 top-12 z-20 inline-flex items-center gap-1.5 rounded-full bg-plum px-3 py-1.5 text-xs font-bold text-white shadow-lg"
              >{{ tease.text }} <Sticker :name="tease.sticker" size="1.1rem"
            /></span>
          </Transition>
        </div>

        <!-- step content -->
        <div class="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-6 sm:px-10 sm:py-8">
          <component :is="current.component" @done="unlock" @restart="restart" />
        </div>

        <!-- step footer -->
        <footer
          class="grid grid-cols-2 items-center gap-3 border-t border-blush-100 bg-white/70 px-5 py-3.5 sm:grid-cols-3"
        >
          <div>
            <button
              v-if="index > 0"
              type="button"
              class="rounded-full px-3 py-1.5 text-sm font-bold text-plum-soft transition hover:bg-blush-50 hover:text-blush-500"
              @click="back"
            >
              ← back
            </button>
          </div>

          <div class="flex justify-end gap-1 sm:justify-center" :aria-label="`Step ${index + 1} of ${steps.length}`">
            <Sticker
              v-for="(_, i) in steps"
              :key="i"
              :name="i <= index ? 'pink-heart' : 'white-heart'"
              size="1rem"
              class="transition duration-300"
              :class="i === index ? 'scale-125' : i < index ? 'opacity-80' : 'opacity-60'"
            />
          </div>

          <div class="col-span-2 flex justify-center sm:col-span-1 sm:justify-end">
            <Transition name="pop" mode="out-in" type="transition">
              <AppButton v-if="current.next && canNext" key="next" class="!px-5 !py-3 text-sm" @click="next">
                <Sticker :name="current.next.sticker" size="1.4em" /> {{ current.next.label }} →
              </AppButton>
              <span
                v-else-if="current.next"
                key="lock"
                class="inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-4 py-2.5 text-center text-xs font-bold text-plum-soft"
                ><Sticker name="lock" size="1.1rem" /> {{ current.lock }}</span
              >
            </Transition>
          </div>
        </footer>
      </div>
    </Transition>
  </div>
</template>

