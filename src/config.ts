// Edit everything in this file to make the site yours.
// Sticker names come from src/stickers.ts (see public/stickers for what each one looks like).
import type { AnimatedStickerName, StickerName } from './stickers'

/** one chat bubble on the welcome window; `big` sends an animated sticker on its own */
export interface ChatMessage {
  text?: string
  sticker?: StickerName
  big?: AnimatedStickerName
}

// a different sweet name for her in each part of the site
const names = {
  intro: 'My Baby',
  welcome: 'Sweetheart',
  letter: 'Honey Bun',
  memories: 'Cutie Pie',
  reasons: 'My Sunshine',
  cake: 'Love Bug',
  question: 'Princess',
  final: 'My Angel',
}

export const config = {
  names,
  yourName: 'my bby boo',

  birthday: { month: 11, day: 5 },

  // the little chat that introduces the site
  intro: {
    messages: [
      { text: 'hiii my love', sticker: 'wave' },
      { text: 'guess what day it is today?', sticker: 'smirk' },
      { text: "it's YOUR birthday!!", sticker: 'party' },
      { text: 'so i made you a little something…' },
      { big: 'gift' },
    ] satisfies ChatMessage[],
    // she taps one of these to answer
    replies: [
      { text: 'omg really?', sticker: 'pleading' },
      { text: 'awww for me?', sticker: 'love-face' },
      { text: 'hehe show me!', sticker: 'grin-squint' },
    ] satisfies ChatMessage[],
    finale: [{ text: 'happy birthday, my favorite person', sticker: 'sparkling-heart' }, { big: 'love-face' }] satisfies ChatMessage[],
  },

  heroSubtitle:
    'Today the whole universe gets to celebrate the day the sweetest, prettiest, most wonderful person was born.',

  letter: {
    greeting: `Dear ${names.letter},`,
    paragraphs: [
      "Happy birthday, sunshine! I wanted to make you something you could open anytime and remember how loved you are. Yes, I actually sat down and built this whole thing for you, so you're officially required to say it's the best gift you've ever gotten.",
      'Thank you for every laugh, every late-night talk, every silly little moment that somehow became my favorite memory. You make ordinary days feel like magic, even the ones where you just reply "ok" and I end up overthinking everything, wondering if I did something wrong or made you upset or disappointed.',
      "I still think about our first date at Marugame Udon. Who knew a bowl of noodles would turn into my favorite person? Out of everything on that menu, you're still the best thing I found there (and yes, I was smooth that day, don't even try to argue).",
      "Now, since it's your birthday, I'm going to be honest about a few things. You work way too hard. You text me \"alright i'm gonna lock in now TTYL :3\" and then disappear for hours, and even while I'm busy working too, I still end up missing you the whole time. You come home exhausted and still act like you're totally fine, and you really think I can't tell. I can always tell.",
      "But here's the truth: I see how hard you work, every single day. The early mornings, the long days, the times you keep going even when you're running on empty, and how you still show up for everyone around you. None of it goes unnoticed. Every good thing coming your way, you earned it yourself, and you deserve every win, every bit of rest, and every happy moment this year is about to bring you.",
      "On your hard days, I hope you remember that you never have to carry anything alone. Drink your water, get some real sleep, and please stop being so hard on yourself, because you're doing so much better than you think.",
      "I'm so proud of you. Proud of how you keep going, of how kind you are to people even when they don't deserve it, and of how you still find a way to make me laugh when I'm being grumpy.",
      "I hope this year brings you everything your heart wishes for: more adventures, more cozy nights, more reasons to smile that pretty smile. And I promise to be right there beside you for all of it (yes, even when you're hangry).",
      "You're my favorite person, my safe place, and my cutest little headache, and I wouldn't trade a single second of it. Now go see the rest of your surprise before I change my mind about being this nice today.",
    ],
    signoff: 'Forever yours,',
  },

  // photos from our second date, taped up on the memories window (files live in public/photos)
  memoriesPhotos: [
    { src: 'photos/ramen-date.jpg', caption: 'dinner at Hako Izakaya', note: 'date #2' },
    { src: 'photos/gelato-date.jpg', caption: 'then gelato after', note: 'still date #2' },
  ],
  futureMemories: [
    'Our first date? Not one single photo…',
    'someone was too busy enjoying the moment to even think about the camera.',
    "So here's our second date instead: Japanese dinner at Hako Izakaya, then gelato together after. Only two photos so far, but they're already my favorites.",
    "Blurry or dark, it doesn't matter. Whenever I'm with you, honey, it's always the best quality to me.",
    'Soon there will be blurry selfies, silly faces, so many more dates together, and a whole camera roll of just us.',
    'This is just the first of many.',
  ],

  // the 8 secret cards on the "reasons i love you" window
  reasons: [
    'I love that we argue through text every day, but I always let you win, just to see your happy smile. Even through the screen, I can see it.',
    'You work so hard for everything you have, and I get so proud just watching you.',
    'At Let\'s Read in Banteay Meanchey, the way you were so patient and gentle with the kids showed me how mature and kind your heart is.',
    'Talking to you never feels long enough, no matter how late it gets.',
    "You're so brave. You face things head on, even the scary ones, and you never stop amazing me.",
    'The way you join charity work and give your time to help the community. Your heart is so beautiful.',
    "You're so much stronger than you give yourself credit for. I see it every day.",
    'Being with you feels like home, and I never want to leave.',
  ],

  candles: 5,

  finalMessage:
    "Thank you for being you. I hope today feels as special as you make every single one of my days. Here's to another year of us.",
}
