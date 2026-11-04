<script setup lang="ts">
import { stickerUrl, type StickerName } from '../stickers'

withDefaults(
  defineProps<{
    name: StickerName
    /** any CSS size; defaults to sitting nicely next to text */
    size?: string
    /** white die-cut outline, like a real sticker */
    cut?: boolean
  }>(),
  { size: '1.25em', cut: false },
)
</script>

<template>
  <img
    :src="stickerUrl(name)"
    alt=""
    aria-hidden="true"
    draggable="false"
    class="inline-block shrink-0 select-none align-[-0.2em]"
    :class="{ 'sticker-cut': cut }"
    :style="{ width: size, height: size }"
  />
</template>
