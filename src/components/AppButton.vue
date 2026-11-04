<script setup lang="ts">
import { burst, burstFromElement, HEARTS } from '../composables/useBurst'
import type { StickerName } from '../stickers'
import Sticker from './Sticker.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'soft'
    /** stickers that burst out on click */
    stickers?: StickerName[]
    /** sticker shown after the label */
    icon?: StickerName
    burstCount?: number
  }>(),
  { variant: 'primary', burstCount: 12 },
)

const emit = defineEmits<{ click: [event: MouseEvent] }>()

function onClick(e: MouseEvent) {
  const options = { stickers: props.stickers ?? HEARTS, count: props.burstCount }
  // keyboard "clicks" have no pointer position, so burst from the button itself
  if (e.detail === 0) burstFromElement(e.currentTarget as Element, options)
  else burst(e.clientX, e.clientY, options)
  emit('click', e)
}
</script>

<template>
  <button type="button" class="btn-cute group" :class="`btn-${variant}`" @click="onClick">
    <span class="btn-shine" />
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
      <Sticker v-if="icon" :name="icon" size="1.4em" class="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
    </span>
  </button>
</template>
