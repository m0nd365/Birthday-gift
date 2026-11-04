<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { config } from '../config'
import { burstFromElement } from '../composables/useBurst'
import SectionTitle from './SectionTitle.vue'
import AppButton from './AppButton.vue'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ done: [] }>()

type State = 'closed' | 'opening' | 'open'
const state = ref<State>('closed')

const fullText = config.letter.paragraphs.join('\n\n')
const typed = ref(0)
const done = computed(() => typed.value >= fullText.length)
let timer: number | undefined

watch(done, (isDone) => isDone && emit('done'))

function openEnvelope(e: MouseEvent) {
  if (state.value !== 'closed') return
  state.value = 'opening'
  burstFromElement(e.currentTarget as Element, { count: 18, stickers: ['love-letter', 'pink-heart', 'two-hearts', 'sparkles'] })
  setTimeout(() => {
    state.value = 'open'
    startTyping()
  }, 750)
}

function startTyping() {
  clearInterval(timer)
  typed.value = 0
  timer = window.setInterval(() => {
    typed.value++
    if (done.value) clearInterval(timer)
  }, 20)
}

function skip() {
  clearInterval(timer)
  typed.value = fullText.length
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div>
    <SectionTitle
      eyebrow="just for you"
      title="A little love letter"
      :subtitle="state === 'open' ? undefined : 'Tap the envelope to open it'"
    />

    <div class="flex min-h-[300px] items-center justify-center">
      <button
        v-if="state !== 'open'"
        type="button"
        class="envelope"
        :class="{ opening: state === 'opening' }"
        aria-label="Open the love letter"
        @click="openEnvelope"
      >
        <span class="env-back" />
        <span class="env-paper" />
        <span class="env-front" />
        <span class="env-flap" />
        <span class="env-seal"><Sticker name="heart" size="30px" /></span>
      </button>

      <Transition name="letter">
        <article v-if="state === 'open'" class="letter-paper relative w-full rounded-3xl px-6 pb-8 pt-10 shadow-xl shadow-blush-300/25 sm:px-10">
          <Sticker name="tulip" size="3.25rem" cut class="absolute -top-6 left-1/2 -translate-x-1/2 -rotate-6" />
          <Sticker name="bow" size="3rem" cut class="absolute -right-3 -top-4 rotate-12" />
          <Sticker name="cherry-blossom" size="2.5rem" cut class="absolute -bottom-3 -left-3 -rotate-12" />

          <p class="font-hand text-3xl text-blush-500">{{ config.letter.greeting }}</p>

          <p class="font-hand mt-3 min-h-[10rem] whitespace-pre-line text-[1.55rem] leading-[2.1rem] text-plum">
            {{ fullText.slice(0, typed) }}<span v-if="!done" class="caret">|</span>
          </p>

          <Transition name="pop">
            <div v-if="done" class="mt-5 flex items-end justify-end gap-2 text-right">
              <div>
                <p class="font-hand text-2xl text-plum-soft">{{ config.letter.signoff }}</p>
                <p class="font-hand text-4xl text-blush-500">{{ config.yourName }}</p>
              </div>
              <AnimatedSticker name="kiss" size="3.5rem" />
            </div>
          </Transition>

          <div v-if="!done" class="mt-6 flex justify-center">
            <AppButton variant="soft" class="!px-5 !py-2.5 text-sm" icon="sparkles" @click="skip">Show it all</AppButton>
          </div>
        </article>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.envelope {
  position: relative;
  width: min(320px, 78vw);
  aspect-ratio: 3 / 2;
  cursor: pointer;
  perspective: 900px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
}
.envelope:not(.opening) {
  animation:
    pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
    float-slow 4s ease-in-out 0.6s infinite;
}
.envelope:hover {
  transform: scale(1.04) rotate(-1deg);
}
.envelope:focus-visible {
  outline: 3px solid var(--color-blush-300);
  outline-offset: 8px;
  border-radius: 18px;
}
.envelope > span {
  position: absolute;
  inset: 0;
  border-radius: 18px;
}
.env-back {
  background: #ffb3c7;
  box-shadow: 0 30px 50px -25px rgb(242 97 138 / 0.7);
}
.env-paper {
  inset: 8% 7% 10% !important;
  background: #fffdf9;
  border-radius: 10px !important;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.env-front {
  background: #ffc8d8;
  clip-path: polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%);
}
.env-flap {
  background: #ff9fbd;
  height: 62%;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  transition: transform 0.6s ease;
  z-index: 2;
}
.env-seal {
  inset: auto !important;
  left: 50% !important;
  top: 50% !important;
  translate: -50% -50%;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 9999px !important;
  background: #f2618a;
  box-shadow: 0 6px 14px rgb(217 70 119 / 0.45);
  animation: heartbeat 1.6s ease-in-out infinite;
  transition: opacity 0.3s;
}
.opening .env-flap {
  transform: rotateX(180deg);
  z-index: 0;
}
.opening .env-seal {
  opacity: 0;
}
.opening .env-paper {
  transform: translateY(-45%);
}

.letter-paper {
  background:
    repeating-linear-gradient(transparent 0 2.1rem, rgb(242 97 138 / 0.12) 2.1rem calc(2.1rem + 1px)),
    linear-gradient(#fffdf9, #fff6f1);
}
.caret {
  animation: blink 0.9s step-end infinite;
  color: var(--color-blush-400);
}
</style>
