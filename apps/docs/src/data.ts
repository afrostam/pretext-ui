/** Generate fake messages of varying lengths for the demo. */
const SAMPLE_TEXTS = [
  "Hey, what's up?",
  "Not much, just working on this new text layout engine. It uses pure arithmetic to compute multiline text height — no DOM reflow needed!",
  "Wait, really? How does that even work? I thought you always needed to render text to the DOM to measure it accurately.",
  "The key insight is that once you know the font metrics (advance widths per glyph, line breaking rules, etc.), you can compute exactly how many lines text will wrap to at a given width. It's deterministic math.",
  "That's wild. So you can lay out an entire virtual list without mounting a single row to the DOM first?",
  "Exactly! Traditional virtual lists either:\n1. Guess row heights (and get it wrong)\n2. Render offscreen to measure (expensive)\n3. Use fixed-height rows (limiting)\n\nWith pretext, you get pixel-perfect variable heights at near-zero cost.",
  "What about different languages? CJK text wraps differently, right?",
  "Yep, it handles CJK, RTL (Arabic, Hebrew), emoji, ligatures — the whole Unicode spec. The segmentation pass identifies grapheme clusters and break opportunities correctly across all scripts.",
  "I need this for my chat app. Right now I'm using getBoundingClientRect() on every message bubble and it absolutely tanks on mobile.",
  "That's the classic problem. DOM reflow for text measurement is O(n) where n is the text length, and browsers serialize it. With pretext it's essentially O(1) after the initial prepare() call, since layout results are cached.",
  "Can I use it with React?",
  "That's what pretext-ui is for! It's a React component library built on top of @chenglou/pretext. VirtualList, ChatBubbles, MasonryGrid — all computed without DOM measurement.",
  "This is a short message.",
  "K",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "The performance difference is most dramatic with long messages and narrow containers. A chat app with 10k messages? pretext layouts them all in under 50ms. DOM reflow would take seconds.",
  "🎉🎊🥳 Ship it!",
  "One more thing — because the layout is pure math, it works identically on server and client. SSR with correct heights, no hydration mismatch.",
  "Does it support word-break: break-all? Some of my users paste long URLs and hex strings that don't have natural break points.",
  "Yes! The prepare() call accepts a whiteSpace option. And the line-breaking algorithm follows UAX #14 (Unicode Line Break Algorithm), so it knows exactly where to break — including inside URLs after slashes and dots.",
];

export interface DemoItem {
  key: string;
  text: string;
}

export function generateItems(count: number): DemoItem[] {
  const items: DemoItem[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      key: `msg-${i}`,
      text: SAMPLE_TEXTS[i % SAMPLE_TEXTS.length],
    });
  }
  return items;
}
