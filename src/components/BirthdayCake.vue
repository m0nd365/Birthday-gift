<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { config } from '../config'
import { burst } from '../composables/useBurst'
import { pop } from '../composables/confetti'
import SectionTitle from './SectionTitle.vue'
import AppButton from './AppButton.vue'
import Sticker from './Sticker.vue'
import AnimatedSticker from './AnimatedSticker.vue'

const emit = defineEmits<{ done: [] }>()

const lit = ref<boolean[]>(Array.from({ length: config.candles }, () => true))
const allOut = computed(() => lit.value.every((l) => !l))
const wishBox = ref<HTMLElement | null>(null)

watch(allOut, async (out) => {
  if (!out) return
  emit('done')
  // on small screens the wish message can sit below the fold of the pop-up
  await nextTick()
  setTimeout(() => wishBox.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 450)
})
const candleColors = ['#ff85a6', '#c58cf0', '#7cc6f2', '#ffd166', '#8ed1b0']

const sprinkles = Array.from({ length: 18 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  top: 30 + ((i * 53) % 55),
  color: candleColors[i % candleColors.length],
  rot: (i * 47) % 180,
}))

function blow(i: number, e: MouseEvent) {
  if (!lit.value[i]) return
  const next = [...lit.value]
  next[i] = false
  lit.value = next
  const r = (e.currentTarget as Element).getBoundingClientRect()
  burst(r.left + r.width / 2, r.top - 10, { count: 6, stickers: ['dash', 'sparkles', 'dizzy'], spread: 70 })
  if (next.every((l) => !l)) {
    setTimeout(() => {
      pop(0.5, 0.55)
      burst(window.innerWidth / 2, window.innerHeight / 2, { count: 30, spread: 260 })
    }, 250)
  }
}

function blowAll() {
  lit.value.forEach((isLit, i) => {
    if (!isLit) return
    setTimeout(() => {
      const el = document.querySelectorAll<HTMLElement>('.candle')[i]
      el?.click()
    }, i * 220)
  })
}

function relight() {
  lit.value = lit.value.map(() => true)
}
</script>

<template>
  <div>
    <SectionTitle :eyebrow="`close your eyes, ${config.names.cake}…`" title="Make a wish" subtitle="Tap each candle to blow it out" />

    <div class="pop-in relative mx-auto w-[300px] select-none [animation-delay:150ms]">
      <!-- candles -->
      <div class="relative z-10 flex h-28 items-end justify-center gap-6">
        <button
          v-for="(isLit, i) in lit"
          :key="i"
          type="button"
          class="candle relative h-16 w-4 cursor-pointer rounded-t-sm transition hover:-translate-y-1"
          :style="{
            background: `repeating-linear-gradient(135deg, ${candleColors[i % candleColors.length]} 0 6px, #fff 6px 10px)`,
          }"
          :aria-label="isLit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`"
          @click="blow(i, $event)"
        >
          <span class="absolute -top-2 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded bg-plum/70" />
          <Transition name="fade">
            <span v-if="isLit" class="flame" />
          </Transition>
          <span v-if="!isLit" class="smoke" />
        </button>
      </div>

      <!-- top tier -->
      <div class="relative mx-auto h-20 w-[210px] overflow-hidden rounded-t-[1.6rem] bg-[#ffd1dc]">
        <span class="frosting" />
        <span
          v-for="(s, i) in sprinkles.slice(0, 8)"
          :key="i"
          class="absolute h-1.5 w-3 rounded-full"
          :style="{ left: `${s.left}%`, top: `${s.top}%`, background: s.color, rotate: `${s.rot}deg` }"
        />
      </div>
      <!-- bottom tier -->
      <div class="relative mx-auto h-24 w-[280px] overflow-hidden rounded-t-[1.6rem] bg-[#fbe3d6]">
        <span class="frosting" />
        <span
          v-for="(s, i) in sprinkles.slice(8)"
          :key="i"
          class="absolute h-1.5 w-3 rounded-full"
          :style="{ left: `${s.left}%`, top: `${s.top}%`, background: s.color, rotate: `${s.rot}deg` }"
        />
        <span class="font-hand absolute inset-x-0 bottom-3 text-center text-2xl text-blush-500">{{ config.names.cake }}</span>
      </div>
      <!-- plate -->
      <div class="mx-auto h-5 w-[320px] -translate-x-[10px] rounded-full bg-white shadow-xl shadow-plum/15" />
    </div>

    <div ref="wishBox" class="mt-8 flex min-h-[110px] flex-col items-center justify-center gap-4 text-center">
      <!-- type="transition": the primary button's endless gradient animation would otherwise stall the swap -->
      <Transition name="pop" mode="out-in" type="transition">
        <div v-if="allOut" key="wish">
          <p class="font-display text-3xl font-semibold">
            Your wish is on its way <AnimatedSticker name="sparkles" size="2.75rem" class="-mt-2" />
          </p>
          <p class="mt-1 text-plum-soft">(I really hope it's about me <Sticker name="relieved" />)</p>
          <AppButton variant="soft" class="mt-5" icon="candle" @click="relight">Relight candles</AppButton>
        </div>
        <AppButton v-else key="blow" :stickers="['dash', 'sparkles', 'cloud']" icon="wind" @click="blowAll">Blow them all</AppButton>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.flame {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  width: 14px;
  height: 24px;
  margin-left: -7px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  background: radial-gradient(circle at 50% 72%, #fffbe0 0 22%, #ffd166 42%, #ff9f43 72%, transparent 74%);
  filter: drop-shadow(0 0 10px #ffb347);
  transform-origin: 50% 90%;
  animation: flicker 0.9s ease-in-out infinite alternate;
}
.smoke {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: rgb(150 130 140 / 0.45);
  animation: smoke 1.4s ease-out forwards;
}
.frosting {
  position: absolute;
  inset: 0 0 auto;
  height: 30px;
  background:
    radial-gradient(circle at 13px 8px, #fff 0 13px, transparent 14px) 0 0 / 26px 30px repeat-x,
    linear-gradient(#fff, #fff) 0 0 / 100% 8px no-repeat;
}
</style>
