import { reactive } from 'vue'
import { HEARTS, type StickerName } from '../stickers'

export { HEARTS, SPARKLES } from '../stickers'

export interface Particle {
  id: number
  kind: 'burst' | 'fall'
  x: number
  y: number
  sticker: StickerName
  dx: number
  dy: number
  rot: number
  size: number
  duration: number
  delay: number
}

interface BurstOptions {
  count?: number
  stickers?: StickerName[]
  spread?: number
}

const particles = reactive<Particle[]>([])
let nextId = 0

export function useParticles() {
  return particles
}

const pick = (list: StickerName[]) => list[Math.floor(Math.random() * list.length)] ?? 'heart'

function add(particle: Omit<Particle, 'id'>) {
  const p = { ...particle, id: nextId++ }
  particles.push(p)
  setTimeout(() => {
    const idx = particles.findIndex((q) => q.id === p.id)
    if (idx !== -1) particles.splice(idx, 1)
  }, p.delay + p.duration)
}

/** Shoot stickers outward from a point on screen (viewport coordinates). */
export function burst(x: number, y: number, { count = 14, stickers = HEARTS, spread = 150 }: BurstOptions = {}) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = spread * (0.45 + Math.random() * 0.75)
    add({
      kind: 'burst',
      x,
      y,
      sticker: pick(stickers),
      dx: Math.cos(angle) * dist,
      // bias upward so it feels like a little firework
      dy: Math.sin(angle) * dist - spread * 0.35,
      rot: (Math.random() - 0.5) * 540,
      size: 20 + Math.random() * 22,
      duration: 900 + Math.random() * 700,
      delay: 0,
    })
  }
}

export function burstFromElement(el: Element, options?: BurstOptions) {
  const r = el.getBoundingClientRect()
  burst(r.left + r.width / 2, r.top + r.height / 2, options)
}

/** Stickers falling from the top of the screen. */
export function rain({ count = 40, stickers = HEARTS }: Omit<BurstOptions, 'spread'> = {}) {
  for (let i = 0; i < count; i++) {
    add({
      kind: 'fall',
      x: Math.random() * window.innerWidth,
      y: -60,
      sticker: pick(stickers),
      dx: (Math.random() - 0.5) * 160,
      dy: window.innerHeight + 140,
      rot: (Math.random() - 0.5) * 360,
      size: 26 + Math.random() * 26,
      duration: 2600 + Math.random() * 1800,
      delay: Math.random() * 1800,
    })
  }
}
