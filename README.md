# 💗 Birthday Gift Website

A cute birthday website built with Vue 3, Tailwind CSS v4, and TypeScript.

## Run it

```bash
npm install
npm run dev      # open the URL it prints
npm run build    # production build in dist/
```

## Make it yours

Everything personal lives in [`src/config.ts`](src/config.ts):

- `names` (top of the file): a different sweet name for each part: gift box `My Baby`, welcome chat `Sweetheart`,
  letter `Honey Bun`, memories `Cutie Pie`, reasons `My Sunshine`, cake `Love Bug`, question `Princess`,
  final window `My Angel`
- `yourName`: currently `my bby boo`; used in the letter sign-off and the final window
- `intro`: the chat on the welcome window (your messages, her tap-to-reply options, and your answer)
- `birthday`: `{ month: 11, day: 5 }` is shown on the welcome window
- `letter`: greeting, paragraphs, and sign-off for the typewriter love letter
- `memoriesPhotos` / `futureMemories`: the photos on the memories window (file lives in `public/photos`) and the note under them
- `reasons`: the 8 secret cards
- `sticker` names in the chat: any sticker name from [`src/stickers.ts`](src/stickers.ts)
  (open `public/stickers/` to see what each one looks like)
- `candles`: how many candles are on the cake
- `finalMessage`: the closing note on the last window

## The flow

After she opens the gift box, each part shows up as its own pop-up window. She taps the button
at the bottom to go to the next one; "← back" goes to the previous one, and the hearts show progress.
Some windows only unlock "Next" after she finishes them (🔒).

1. **Gift intro**: tap the wiggling gift, the lid flies off, confetti
2. **hi birthday girl 🎀** 🔒: her little profile, then a chat where you text her (with typing dots).
   She taps a reply, you answer, and the big "Happy Birthday" card pops in with confetti
3. **a little letter 💌** 🔒: tap the envelope, the letter types itself out (unlocks when finished or "Show it all")
4. **our future memories 📸**: the two date #2 photos (dinner, then gelato) taped up like polaroids, plus a note that many more are coming
5. **reasons i love you 💝** 🔒: 8 sealed secret cards that flip open (opening all 8 = confetti and unlocks "Next")
6. **make a wish 🕯️** 🔒: tap the candles to blow them out
7. **one last question 🥺** 🔒: "Do you love me?" The No button runs away, the Yes button keeps growing
8. **forever & always 💗**: final message, heart rain, and a "Replay from the start" button

The ✕ on each window refuses to close it. 3D stickers float in the background and every tap sparkles.
The order, window titles and button labels live in the `steps` list in `src/App.vue`.

## Stickers

There are no system emoji in the site. Everything uses bundled sticker artwork in `public/stickers/`:

- **3D stickers** (`*.png`): [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji), MIT license
- **Animated stickers** (`animated/*.json`, played with `lottie-web`):
  [Google Noto Animated Emoji](https://googlefonts.github.io/noto-emoji-animation/), CC BY 4.0

Use `<Sticker name="bow" />` for a still sticker (add `cut` for a white die-cut outline) and
`<AnimatedSticker name="love-face" />` for a moving one.

## Deploy

Run `npm run build`, then drag the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop),
or push the project to GitHub and import it on Vercel.
