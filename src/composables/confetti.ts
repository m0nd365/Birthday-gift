import confetti from 'canvas-confetti'

const colors = ['#ffb3c7', '#ff85a6', '#fbc4ab', '#cdb4db', '#ffd6a5', '#ffffff']

/** Two side cannons for ~1.5s. */
export function celebrate() {
  const end = Date.now() + 1500
  const frame = () => {
    confetti({ particleCount: 4, angle: 60, spread: 65, origin: { x: 0, y: 0.75 }, colors, disableForReducedMotion: true })
    confetti({ particleCount: 4, angle: 120, spread: 65, origin: { x: 1, y: 0.75 }, colors, disableForReducedMotion: true })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** One big pop from a point (0–1 of the viewport). */
export function pop(x = 0.5, y = 0.5) {
  confetti({ particleCount: 140, spread: 100, startVelocity: 42, origin: { x, y }, colors, disableForReducedMotion: true })
}
