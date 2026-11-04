<script setup lang="ts">
import { config } from '../config'
import SectionTitle from './SectionTitle.vue'
import Sticker from './Sticker.vue'

const lines = config.futureMemories
const photos = config.memoriesPhotos.map((p) => ({ ...p, src: `${import.meta.env.BASE_URL}${p.src}` }))
</script>

<template>
  <div>
    <SectionTitle :eyebrow="`the first of many, ${config.names.memories}`" title="Our future memories" />

    <!-- our second date, taped up side by side like polaroids -->
    <div class="mx-auto flex max-w-md items-start justify-center gap-3 px-2 pt-2 sm:gap-5">
      <div
        v-for="(p, i) in photos"
        :key="p.src"
        class="frame pop-in relative w-1/2 max-w-[210px] rounded-2xl p-2.5 pb-1.5"
        :class="i % 2 ? 'frame-right mt-4' : 'frame-left'"
        :style="{ animationDelay: `${150 + i * 200}ms` }"
      >
        <span class="tape" aria-hidden="true" />
        <img :src="p.src" :alt="p.caption" class="photo aspect-square w-full rounded-xl object-cover" />
        <span class="font-hand mt-1 block text-lg leading-6 text-blush-500">{{ p.caption }}</span>
        <span class="font-hand block text-sm leading-5 text-plum-soft">{{ p.note }}</span>
        <Sticker v-if="i === 0" name="camera" size="2.2rem" class="animate-float-slow absolute -left-4 -top-4 -rotate-12 drop-shadow-lg" />
        <template v-else>
          <Sticker name="sparkles" size="1.4rem" class="twinkle absolute -right-3 top-5" />
          <Sticker name="pink-heart" size="1.4rem" class="twinkle absolute -bottom-2 -right-2 [animation-delay:-1.2s]" />
        </template>
      </div>
    </div>

    <div class="mx-auto max-w-sm text-center">

      <div class="mt-7 space-y-3">
        <p
          v-for="(line, i) in lines"
          :key="line"
          class="line font-hand text-[1.6rem] leading-8"
          :class="i === lines.length - 1 ? 'text-blush-500' : 'text-plum'"
          :style="{ animationDelay: `${500 + i * 700}ms` }"
        >
          {{ line }}
        </p>
      </div>

      <p class="line mt-6 text-sm font-bold text-plum-soft" :style="{ animationDelay: `${500 + lines.length * 700}ms` }">
        sooner than you think <Sticker name="revolving-hearts" />
      </p>
    </div>
  </div>
</template>

<style scoped>
.frame {
  border: 2.5px dashed var(--color-blush-300);
  background: linear-gradient(135deg, #fff, var(--color-blush-50));
  box-shadow: 0 18px 34px -20px rgb(242 97 138 / 0.6);
  text-align: center;
}
.frame-left {
  rotate: -4deg;
}
.frame-right {
  rotate: 3deg;
}
/* the photos were taken somewhere dim, so lift them a little */
.photo {
  filter: brightness(1.25) saturate(1.1);
}
.tape {
  position: absolute;
  left: 50%;
  top: -12px;
  width: 80px;
  height: 24px;
  translate: -50% 0;
  rotate: 4deg;
  background: rgb(255 200 216 / 0.75);
  border-left: 2px dashed rgb(255 255 255 / 0.6);
  border-right: 2px dashed rgb(255 255 255 / 0.6);
}
.twinkle {
  animation: twinkle 2.4s ease-in-out infinite;
}
/* each line of the note fades up one after another */
.line {
  animation: line-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards;
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
@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(4px);
  }
}
</style>
