/**
 * Canned AI responses keyed by loose topic matching.
 * When wired to a real API later, replace streamResponse() with an API call.
 */

const RESPONSES: { triggers: RegExp; response: string }[] = [
  {
    triggers: /\b(hello|hi|hey|sup|yo|greet)\b/i,
    response:
      "Hey! I'm a demo AI assistant built with pretext-ui. Every part of this interface — the message list, the bubbles, the auto-growing input, and this streaming text — uses @chenglou/pretext for text measurement.\n\nNo DOM reflow anywhere. Ask me anything!",
  },
  {
    triggers: /\b(pretext|library|how.*(work|does))\b/i,
    response:
      "pretext is a pure JavaScript text layout engine by @chenglou. Here's the key insight:\n\nOnce you know a font's glyph widths and the Unicode line break rules (UAX #14), computing how many lines text wraps to at a given width is just arithmetic. No rendering needed.\n\nThe flow is:\n1. **prepare()** — segments text, measures glyph widths via canvas (one-time cost, cached)\n2. **layout()** — computes line count + height with pure math (essentially free)\n\nThis is 10-100x faster than the traditional approach of rendering text to a hidden DOM element and calling getBoundingClientRect().",
  },
  {
    triggers: /\b(virtual|scroll|list|performance|fast|speed)\b/i,
    response:
      "The VirtualList in this app uses pretext to compute the exact height of every message — all with pure arithmetic.\n\nHere's what makes it different from react-virtualized or tanstack-virtual:\n\n- **No height estimation.** Every row height is exact from the start.\n- **No measurement phase.** No rendering rows offscreen to read their height.\n- **No corrections.** The scrollbar never jumps because heights never change.\n\nThe entire message history (thousands of messages) has its heights computed in a few milliseconds. Scroll around — you'll notice it never stutters or flashes.",
  },
  {
    triggers: /\b(stream|typing|shift|layout.?shift|cls)\b/i,
    response:
      "Watch this text as it streams in. Notice how the messages below don't shift?\n\nTraditionally, streaming text causes Cumulative Layout Shift (CLS) — content jumps as new tokens change the text height. Chat apps, AI interfaces, and live feeds all suffer from this.\n\npretext-ui's StreamingText component solves this by pre-computing the exact height on every token. The container is always the right size before the browser paints. Result: zero CLS, smooth streaming, no jank.\n\nThis is particularly important on mobile where layout shifts feel much worse due to the smaller viewport.",
  },
  {
    triggers: /\b(bubble|chat|message|shrink|wrap|width)\b/i,
    response:
      "Each message bubble in this UI is \"shrink-wrapped\" — it's only as wide as its widest text line, plus padding.\n\nThe traditional approach to this is:\n1. Render the text in a hidden element\n2. Read its actual width with getBoundingClientRect()\n3. Apply that width to the visible bubble\n\nWith pretext, we use layoutWithLines() to get the width of each line, find the maximum, and set the bubble width — all without touching the DOM.\n\nTry sending a short message like \"ok\" vs a long paragraph. The bubbles fit perfectly.",
  },
  {
    triggers: /\b(input|textarea|resize|grow|type)\b/i,
    response:
      "The input box at the bottom uses pretext-ui's AutoResizeInput. As you type, it grows. When you delete, it shrinks.\n\nMost auto-resize textareas work by:\n- Creating a hidden mirror element with the same styles\n- Copying the text into it\n- Reading scrollHeight\n- Applying that height to the real textarea\n\nThat's 2 DOM writes + 1 forced reflow per keystroke. On a fast typist, that's 10+ reflows per second.\n\nAutoResizeInput just calls measureHeight() — pure arithmetic. The height is always correct on the first try, and it never touches the DOM for measurement.",
  },
  {
    triggers: /\b(emoji|cjk|rtl|arabic|hebrew|unicode|language)\b/i,
    response:
      "pretext handles the full Unicode spec:\n\n- **CJK** (Chinese, Japanese, Korean) — characters can break almost anywhere, but not after opening brackets or before closing ones\n- **RTL** (Arabic, Hebrew) — the bidi algorithm runs during prepare()\n- **Emoji** — variable widths, zero-width joiners, skin tone modifiers\n- **Ligatures** — fi, fl, ffi in Latin fonts\n\nThe segmentation pass uses the Unicode Line Break Algorithm (UAX #14) and grapheme cluster rules (UAX #29) to get break points right across all scripts.\n\nTry pasting some emoji or non-Latin text!",
  },
  {
    triggers: /\b(react|component|hook|api|install)\b/i,
    response:
      "The API is designed to be simple:\n\n```\nimport { VirtualList, ChatBubbles, AutoResizeInput, StreamingText } from \"@pretext-ui/react\";\n```\n\nEvery component takes a `font` string and `lineHeight` in pixels. These must match your CSS — pretext uses them for its arithmetic.\n\nThere are also composable hooks if you want more control:\n- `useVirtualList()` — returns visible rows, total height, scroll handler\n- `useChatBubbles()` — returns bubble layouts with computed widths\n- `useMasonryLayout()` — returns card positions for masonry grids\n\nPlus low-level helpers: `measureHeight()`, `measureText()`, `measureLines()`.",
  },
];

const FALLBACK =
  "That's an interesting question! I'm a demo assistant with a limited set of topics. Try asking me about:\n\n- How pretext works\n- The virtual list performance\n- Streaming text and layout shift\n- Chat bubble sizing\n- The auto-resize input\n- Unicode and emoji support\n- The React component API\n\nOr just say hi!";

export function getResponse(userMessage: string): string {
  for (const { triggers, response } of RESPONSES) {
    if (triggers.test(userMessage)) {
      return response;
    }
  }
  return FALLBACK;
}
