<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { config, type ChatMessage } from '../config'
import { burst } from '../composables/useBurst'
import { celebrate } from '../composables/confetti'
import { animatedStickerUrl } from '../stickers'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ done: [] }>()

const { month, day } = config.birthday
const daySuffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th'

// her next birthday (today counts), for the weekday and the little countdown on the date card
const today = new Date()
today.setHours(0, 0, 0, 0)
let nextBirthday = new Date(today.getFullYear(), month - 1, day)
if (nextBirthday < today) nextBirthday = new Date(today.getFullYear() + 1, month - 1, day)
const daysLeft = Math.round((nextBirthday.getTime() - today.getTime()) / 86_400_000)

const monthLabel = nextBirthday.toLocaleDateString('en-US', { month: 'long' })
const monthShort = nextBirthday.toLocaleDateString('en-US', { month: 'short' })
const weekday = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' })
const countdown = daysLeft === 0 ? "it's today!" : daysLeft === 1 ? 'tomorrow!' : `in ${daysLeft} days`

interface Bubble extends ChatMessage {
  id: number
  from: 'me' | 'her'
}

const bubbles = ref<Bubble[]>([])
const typing = ref(false)
const stage = ref<'chat' | 'reply' | 'replied' | 'reveal'>('chat')
const root = ref<HTMLElement | null>(null)

let alive = true
let nextId = 0
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// the pop-up's scrolling content area (the nearest scrollable parent)
let scroller: HTMLElement | null = null
function findScroller(el: HTMLElement | null) {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (overflowY === 'auto' || overflowY === 'scroll') return p
  }
  return null
}

// a calmer eased scroll than the browser's built-in one; a new call smoothly retargets the running one
let scrollFrame = 0
function glideTo(el: HTMLElement, target: number) {
  cancelAnimationFrame(scrollFrame)
  const start = el.scrollTop
  const distance = target - start
  if (Math.abs(distance) < 1) return
  // longer trips take a little longer, so speed stays gentle
  const duration = Math.min(1200, Math.max(500, Math.abs(distance) * 2))
  const t0 = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / duration)
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // ease-in-out cubic
    el.scrollTop = start + distance * eased
    if (t < 1) scrollFrame = requestAnimationFrame(step)
  }
  scrollFrame = requestAnimationFrame(step)
}

/** scroll to the newest message (only does anything once the chat is taller than the window) */
function scrollDown() {
  nextTick(() =>
    requestAnimationFrame(() => {
      scroller ??= findScroller(root.value)
      if (scroller) glideTo(scroller, scroller.scrollHeight - scroller.clientHeight)
    }),
  )
}

/** a short pause, "typing…" for a moment, then the bubble takes the typing bubble's place */
async function say(message: ChatMessage) {
  await wait(450)
  if (!alive) return
  typing.value = true
  scrollDown()
  await wait(Math.min(1700, 850 + (message.text?.length ?? 14) * 18))
  if (!alive) return
  typing.value = false
  bubbles.value.push({ ...message, id: nextId++, from: 'me' })
  scrollDown()
}

onMounted(async () => {
  // warm the cache so animated stickers appear the moment their bubble does
  for (const m of [...config.intro.messages, ...config.intro.finale]) {
    if ('big' in m && m.big) fetch(animatedStickerUrl(m.big)).catch(() => {})
  }
  await wait(600)
  for (const m of config.intro.messages) {
    if (!alive) return
    await say(m)
  }
  await wait(500)
  if (!alive) return
  stage.value = 'reply'
  scrollDown()
})
onBeforeUnmount(() => {
  alive = false
  cancelAnimationFrame(scrollFrame)
})

async function reply(r: ChatMessage, e: MouseEvent) {
  if (stage.value !== 'reply') return
  burst(e.clientX, e.clientY, { count: 10 })
  // keep the chips' space reserved while they fade, so the chat never shrinks and snaps the scroll
  if (root.value) root.value.style.minHeight = `${root.value.offsetHeight}px`
  // let the reply chips fade away first, then send her bubble
  stage.value = 'replied'
  await wait(220)
  if (!alive) return
  bubbles.value.push({ ...r, id: nextId++, from: 'her' })
  scrollDown()
  for (const m of config.intro.finale) {
    if (!alive) return
    await say(m)
  }
  await wait(450)
  if (!alive) return
  stage.value = 'reveal'
  celebrate()
  emit('done')
  scrollDown()
}
</script>

<template>
  <div ref="root" class="relative mx-auto max-w-md">
    <Sticker name="bow" size="3.25rem" cut class="animate-float-slow absolute -left-2 top-0 -rotate-12 sm:-left-16" />
    <Sticker name="cupcake" size="3.25rem" cut class="animate-float-slow absolute -right-2 top-2 rotate-12 [animation-delay:-2s] sm:-right-16" />

    <!-- her little profile -->
    <header class="pop-in flex flex-col items-center text-center">
      <div class="mt-2 flex items-center gap-2">
        <Sticker name="sparkles" size="1.2rem" class="twinkle -scale-x-100" />
        <h2 class="font-display text-shimmer text-4xl font-semibold italic leading-tight">{{ config.names.welcome }}</h2>
        <Sticker name="sparkles" size="1.2rem" class="twinkle [animation-delay:-1.2s]" />
      </div>
      <svg class="squiggle -mt-0.5 h-3 w-32" viewBox="0 0 128 12" fill="none" aria-hidden="true">
        <path d="M2 6 Q 12 0 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 126 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </svg>

      <!-- her day, as a little hanging calendar card -->
      <div class="date-card mt-5">
        <div class="cal">
          <span class="cal-rings"><i /><i /></span>
          <span class="cal-month">{{ monthShort }}</span>
          <span class="cal-day font-display">{{ day }}</span>
        </div>
        <div class="text-left">
          <p class="font-display text-xl font-semibold italic leading-tight text-plum">
            {{ monthLabel }} {{ day }}<sup class="text-[0.6em]">{{ daySuffix }}</sup>
          </p>
          <p class="mt-1 flex items-center gap-2 whitespace-nowrap text-xs font-bold text-plum-soft">
            {{ weekday }}
            <span class="countdown" :class="{ 'is-today': daysLeft === 0 }">
              <Sticker name="sparkling-heart" size="0.95rem" /> {{ countdown }}
            </span>
          </p>
        </div>
        <Sticker name="balloon" size="1.9rem" class="balloon-sway ml-1" />
      </div>
    </header>

    <!-- chat -->
    <div class="mt-7 flex flex-col">
      <div class="pop-in mb-4 flex items-center gap-3 [animation-delay:200ms]">
        <span class="h-px flex-1 bg-gradient-to-r from-transparent to-blush-200" />
        <span class="flex items-center gap-1.5 rounded-full bg-blush-50 py-1 pl-2 pr-3 text-xs font-bold text-blush-500">
          <Sticker name="love-letter" size="1.15rem" class="animate-wiggle" /> new message, just for you
        </span>
        <span class="h-px flex-1 bg-gradient-to-l from-transparent to-blush-200" />
      </div>

      <!-- one animated list: the typing bubble hands its spot to the new message, everything else glides -->
      <TransitionGroup tag="div" name="chat" class="flex flex-col gap-2.5">
        <div v-for="b in bubbles" :key="b.id" class="chat-item" :class="b.from === 'me' ? 'from-me' : 'from-her'">
          <AnimatedSticker v-if="b.big" :name="b.big" size="5.5rem" />
          <div v-else class="bubble" :class="b.from === 'me' ? 'bubble-me' : 'bubble-her'">
            {{ b.text }} <Sticker v-if="b.sticker" :name="b.sticker" size="1.5em" />
          </div>
        </div>
        <div v-if="typing" key="typing" class="chat-item from-me" aria-label="typing">
          <div class="bubble bubble-me typing">
            <span class="dot" /><span class="dot [animation-delay:150ms]" /><span class="dot [animation-delay:300ms]" />
          </div>
        </div>
      </TransitionGroup>

      <!-- her quick replies -->
      <Transition name="replies">
        <div v-if="stage === 'reply'" class="mt-4 flex flex-col items-end gap-2">
          <p class="text-[0.7rem] font-bold uppercase tracking-wider text-plum-soft">tap to reply</p>
          <div class="flex flex-wrap justify-end gap-2">
            <button
              v-for="(r, i) in config.intro.replies"
              :key="r.text"
              type="button"
              class="reply-chip inline-flex items-center gap-1.5 rounded-full border-2 border-blush-200 bg-white py-2 pl-4 pr-3 text-sm font-bold text-blush-500"
              :style="{ animationDelay: `${120 + i * 80}ms` }"
              @click="reply(r, $event)"
            >
              {{ r.text }} <Sticker v-if="r.sticker" :name="r.sticker" size="1.4em" />
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- the big reveal -->
    <Transition name="reveal">
      <div v-if="stage === 'reveal'" class="mt-8 rounded-[1.75rem] bg-gradient-to-br from-blush-50 via-white to-[#f6efff] px-5 py-7 text-center">
        <h1 class="font-display text-[clamp(2.6rem,9vw,4rem)] font-semibold leading-[0.95] tracking-tight">
          My Baby <span class="text-shimmer italic">Girl</span>
        </h1>
        <p class="mx-auto mt-4 max-w-sm text-sm text-plum-soft">{{ config.heroSubtitle }}</p>
        <div class="mt-4 flex justify-center gap-2">
          <Sticker v-for="s in (['balloon', 'shortcake', 'gift', 'tulip'] as const)" :key="s" :name="s" size="2.5rem" cut />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.twinkle {
  animation: twinkle 2.4s ease-in-out infinite;
}
.squiggle {
  color: var(--color-blush-300);
  stroke-dasharray: 160;
  animation: draw 1.2s 0.5s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
/* her date card: pops in, then floats gently with a shifting rainbow border and a shine sweeping across */
.date-card {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem 1.1rem 0.6rem 0.75rem;
  border-radius: 1.4rem;
  border: 2px solid transparent;
  background:
    linear-gradient(#fff, var(--color-blush-50)) padding-box,
    linear-gradient(120deg, #ffa6bf, #c58cf0, #ffd166, #8ed1b0, #ffa6bf) border-box;
  background-size:
    100% 100%,
    300% 300%;
  box-shadow: 0 14px 28px -14px rgb(242 97 138 / 0.6);
  animation:
    pop-in 0.6s 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
    gradient-shift 5s ease infinite,
    card-bob 3.2s ease-in-out infinite;
}
.date-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgb(255 255 255 / 0.85) 50%, transparent 65%);
  translate: -120% 0;
  animation: card-shine 4.5s 1s ease-in-out infinite;
  pointer-events: none;
}
/* a tiny tear-off calendar page that sways from its rings */
.cal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 3.2rem;
  border-radius: 0.8rem;
  background: #fff;
  text-align: center;
  box-shadow: 0 6px 14px -8px rgb(75 42 62 / 0.45);
  transform-origin: 50% 0;
  animation: cal-swing 3s ease-in-out infinite;
}
.cal-rings {
  position: absolute;
  top: -0.35rem;
  inset-inline: 0;
  display: flex;
  justify-content: space-between;
  padding-inline: 0.7rem;
}
.cal-rings i {
  width: 0.4rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: var(--color-plum-soft);
  border: 2px solid #fff;
}
.cal-month {
  border-radius: 0.8rem 0.8rem 0 0;
  padding: 0.3rem 0 0.15rem;
  background: linear-gradient(135deg, #ff85a6, #f2618a 60%, #c58cf0);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.cal-day {
  padding: 0.15rem 0 0.3rem;
  font-size: 1.7rem;
  font-weight: 600;
  line-height: 1;
  color: var(--color-plum);
  transform-origin: 50% 0;
  animation: day-flip 0.7s 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}
.countdown {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.55rem 0.15rem 0.35rem;
  border-radius: 9999px;
  background: var(--color-blush-100);
  color: var(--color-blush-500);
}
.countdown.is-today {
  animation: var(--animate-heartbeat);
}
.balloon-sway {
  transform-origin: 50% 90%;
  animation: balloon-sway 2.6s ease-in-out infinite;
}

/* ---------- bubbles ---------- */

.chat-item {
  max-width: 80%;
}
.from-me {
  align-self: flex-start;
  transform-origin: bottom left;
}
.from-her {
  align-self: flex-end;
  transform-origin: bottom right;
}
.bubble {
  width: fit-content;
  padding: 0.65rem 1rem;
  border-radius: 1.4rem;
  font-weight: 600;
  line-height: 1.35;
  box-shadow: 0 8px 18px -12px rgb(75 42 62 / 0.35);
}
.bubble-me {
  background: white;
  color: var(--color-plum);
  border-bottom-left-radius: 0.4rem;
}
.bubble-her {
  margin-left: auto;
  color: white;
  background: linear-gradient(135deg, #ff85a6, #f2618a 60%, #c58cf0);
  border-bottom-right-radius: 0.4rem;
}
.typing {
  display: flex;
  gap: 0.25rem;
  padding-block: 0.9rem;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--color-blush-300);
  animation: typing 1.1s ease-in-out infinite;
}

/* ---------- list transitions (no bouncing, no jumping) ---------- */

.chat-enter-active {
  transition:
    opacity 0.3s ease-out,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.92);
}
/* the typing bubble steps out of the layout instantly, so the new message lands in its exact spot */
.chat-leave-active {
  position: absolute;
  visibility: hidden;
  transition: none;
}
.chat-move {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.replies-enter-active {
  transition:
    opacity 0.35s ease-out,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.replies-leave-active {
  transition:
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}
.replies-enter-from,
.replies-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.replies-enter-active .reply-chip {
  animation: chip-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.reveal-enter-active {
  transition:
    opacity 0.5s ease-out,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.97);
}

.reply-chip {
  transition:
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.2s;
}
.reply-chip:hover {
  transform: translateY(-2px);
  background: var(--color-blush-50);
}
.reply-chip:active {
  transform: scale(0.96);
}

@keyframes chip-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
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
@keyframes card-bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -4px;
  }
}
@keyframes card-shine {
  0% {
    translate: -120% 0;
  }
  35%,
  100% {
    translate: 120% 0;
  }
}
@keyframes cal-swing {
  0%,
  100% {
    rotate: -4deg;
  }
  50% {
    rotate: 4deg;
  }
}
@keyframes day-flip {
  from {
    opacity: 0;
    transform: perspective(200px) rotateX(-90deg);
  }
}
@keyframes balloon-sway {
  0%,
  100% {
    rotate: -10deg;
  }
  50% {
    rotate: 10deg;
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 160;
  }
}
</style>
