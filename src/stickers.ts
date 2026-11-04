// Sticker artwork lives in /public/stickers:
//   *.png           Microsoft Fluent Emoji 3D (MIT)          https://github.com/microsoft/fluentui-emoji
//   animated/*.json Google Noto Animated Emoji (CC BY 4.0)   https://googlefonts.github.io/noto-emoji-animation/

export const STICKERS = [
  'airplane', 'balloon', 'blossom', 'bow', 'broken-heart', 'bubbles', 'butterfly', 'cake', 'camera', 'candle',
  'cherries', 'cherry-blossom', 'clink', 'cloud', 'coffee', 'confetti-ball', 'crying', 'cupcake', 'dash', 'dizzy',
  'gift', 'glowing-star', 'grin-squint', 'growing-heart', 'heart', 'heart-arrow', 'heart-eyes', 'heart-hands',
  'heart-ribbon', 'house', 'huff', 'joy', 'kiss', 'lock', 'love-face', 'love-letter', 'monkey', 'moon', 'muscle',
  'party', 'pink-heart', 'pleading', 'pray', 'rainbow', 'ramen', 'relieved', 'repeat', 'revolving-hearts', 'rose',
  'shortcake', 'smile', 'smirk', 'sparkles', 'sparkling-heart', 'star', 'strawberry', 'sunset', 'teddy', 'tulip',
  'two-hearts', 'wave', 'white-heart', 'wind', 'wink-tongue', 'zany',
] as const

export const ANIMATED_STICKERS = [
  'sparkling-heart', 'growing-heart', 'revolving-hearts', 'two-hearts', 'love-letter', 'cake', 'gift', 'party',
  'sparkles', 'love-face', 'heart-eyes', 'pleading', 'kiss', 'heart-hands', 'rose', 'balloon', 'crying', 'relieved',
  'wave',
] as const

export type StickerName = (typeof STICKERS)[number]
export type AnimatedStickerName = (typeof ANIMATED_STICKERS)[number]

const base = import.meta.env.BASE_URL

export const stickerUrl = (name: StickerName) => `${base}stickers/${name}.png`
export const animatedStickerUrl = (name: AnimatedStickerName) => `${base}stickers/animated/${name}.json`

// handy sets for bursts and rain
export const HEARTS: StickerName[] = ['heart', 'pink-heart', 'sparkling-heart', 'two-hearts', 'growing-heart', 'heart-ribbon', 'cherry-blossom', 'sparkles', 'bow']
export const SPARKLES: StickerName[] = ['sparkles', 'glowing-star', 'star', 'dizzy']
