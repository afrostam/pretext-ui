# pretext-ui

React component library powered by [`@chenglou/pretext`](https://github.com/chenglou/pretext) — a text layout engine that computes multiline text height with pure arithmetic. No DOM reflow.

## Why?

Every React app that renders dynamic text eventually hits the same problem: you need to know how tall text will be _before_ rendering it. Traditional solutions either guess (and get it wrong), render offscreen to measure (expensive), or just accept layout shift.

**pretext-ui eliminates this entirely.** Given a font and a container width, pretext computes the exact pixel height of any text — instantly, with no DOM access. This library wraps that capability into composable React components.

## Components

| Component | What it does |
|---|---|
| [`VirtualList`](#virtuallist) | Infinite scroll with variable row heights |
| [`ChatBubbles`](#chatbubbles) | Shrink-wrapped message bubbles |
| [`AutoResizeInput`](#autoresizeinput) | Growing textarea |
| [`MasonryGrid`](#masonrygrid) | Pinterest-style card layout |
| [`StreamingText`](#streamingtext) | AI streaming text without layout shift |

## Install

```bash
npm install @pretext-ui/react @chenglou/pretext
# or
pnpm add @pretext-ui/react @chenglou/pretext
```

`@chenglou/pretext` is a peer-ish dependency — it's required at runtime for text measurement.

## Quick Start

```tsx
import { VirtualList } from "@pretext-ui/react";

const items = messages.map((msg) => ({ key: msg.id, text: msg.body }));

<VirtualList
  items={items}
  font="16px Inter, sans-serif"
  lineHeight={24}
  renderRow={(row) => <div className="p-4">{row.item.text}</div>}
  style={{ height: 600 }}
/>
```

Every component requires a `font` string and `lineHeight` in pixels. These must match your CSS — pretext uses them for its arithmetic.

---

## API Reference

### VirtualList

Infinite scroll list with variable row heights computed by pretext. No DOM measurement, no height guessing.

```tsx
import { VirtualList } from "@pretext-ui/react";
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `VirtualListItem[]` | required | Array of `{ key: string, text: string }` |
| `font` | `string` | required | CSS font string, e.g. `"16px Inter, sans-serif"` |
| `lineHeight` | `number` | required | Line height in px |
| `rowPadding` | `number` | `16` | Vertical padding per row (top + bottom) |
| `overscan` | `number` | `5` | Extra rows rendered beyond viewport |
| `renderRow` | `(row: VirtualRow) => ReactNode` | required | Row render function |
| `className` | `string` | — | Container className |
| `style` | `CSSProperties` | — | Container style |

**Hook:** `useVirtualList(options)` returns `{ containerRef, totalHeight, visibleRows, offsetY, onScroll }` for custom implementations.

---

### ChatBubbles

Message bubbles shrink-wrapped to their widest line. Each bubble's width is computed by laying out the text and finding the widest line — no DOM reads.

```tsx
import { ChatBubbles } from "@pretext-ui/react";

const messages = [
  { key: "1", text: "Hey!", sender: "other" as const },
  { key: "2", text: "What's up?", sender: "self" as const },
];

<ChatBubbles
  messages={messages}
  font="14px Inter, sans-serif"
  lineHeight={20}
  maxBubbleWidth={320}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `messages` | `ChatMessage[]` | required | Array of `{ key, text, sender: "self" \| "other", timestamp? }` |
| `font` | `string` | required | CSS font string |
| `lineHeight` | `number` | required | Line height in px |
| `maxBubbleWidth` | `number` | `320` | Maximum bubble width |
| `minBubbleWidth` | `number` | `48` | Minimum bubble width |
| `horizontalPadding` | `number` | `24` | Horizontal padding (left + right) |
| `verticalPadding` | `number` | `16` | Vertical padding (top + bottom) |
| `gap` | `number` | `4` | Space between messages |
| `renderBubble` | `(layout: BubbleLayout) => ReactNode` | — | Custom bubble renderer |
| `className` | `string` | — | Container className |
| `style` | `CSSProperties` | — | Container style |

**Hook:** `useChatBubbles(options)` returns `BubbleLayout[]` with `{ message, bubbleWidth, textHeight, lineCount }`.

---

### AutoResizeInput

A textarea that grows and shrinks as you type. Height is computed by pretext on every change — no hidden mirror element, no `scrollHeight` hack.

```tsx
import { AutoResizeInput } from "@pretext-ui/react";

<AutoResizeInput
  font="16px Inter, sans-serif"
  lineHeight={24}
  minLines={1}
  maxLines={10}
  placeholder="Type something..."
  onChange={(e) => console.log(e.target.value)}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `font` | `string` | required | CSS font string |
| `lineHeight` | `number` | required | Line height in px |
| `minLines` | `number` | `1` | Minimum visible lines |
| `maxLines` | `number` | `Infinity` | Maximum lines before scrolling |
| `verticalPadding` | `number` | `16` | Vertical padding (top + bottom) |
| `onHeightChange` | `(height: number) => void` | — | Called when computed height changes |
| `...rest` | `TextareaHTMLAttributes` | — | All standard textarea props (`value`, `onChange`, `placeholder`, etc.) |

Supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) modes.

---

### MasonryGrid

Pinterest-style card layout. Cards are placed into the shortest column, with heights computed by pretext. The entire layout is pure arithmetic.

```tsx
import { MasonryGrid } from "@pretext-ui/react";

<MasonryGrid
  items={cards}
  font="14px Inter, sans-serif"
  lineHeight={20}
  columns={3}
  renderCard={(layout) => (
    <div className="card">{layout.item.text}</div>
  )}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MasonryItem[]` | required | Array of `{ key: string, text: string }` |
| `font` | `string` | required | CSS font string |
| `lineHeight` | `number` | required | Line height in px |
| `columns` | `number` | `3` | Number of columns |
| `gap` | `number` | `16` | Gap between cards |
| `cardPadding` | `number` | `24` | Vertical padding per card |
| `cardHorizontalPadding` | `number` | `24` | Horizontal padding per card |
| `renderCard` | `(layout: MasonryCardLayout) => ReactNode` | required | Card render function |
| `className` | `string` | — | Container className |
| `style` | `CSSProperties` | — | Container style |

**Hook:** `useMasonryLayout(options)` returns `{ cards: MasonryCardLayout[], totalHeight }` for custom implementations.

---

### StreamingText

Renders AI-streamed text without layout shift. As tokens arrive, the container is pre-sized to the exact height the text will occupy.

```tsx
import { StreamingText } from "@pretext-ui/react";

<StreamingText
  text={partialResponse}
  font="16px Inter, sans-serif"
  lineHeight={24}
  isStreaming={true}
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | required | Current text (grows as tokens stream in) |
| `font` | `string` | required | CSS font string |
| `lineHeight` | `number` | required | Line height in px |
| `isStreaming` | `boolean` | `false` | Shows blinking cursor when true |
| `textClassName` | `string` | — | className for the text element |
| `onHeightChange` | `(height: number) => void` | — | Called when computed height changes |
| `className` | `string` | — | Container className |
| `style` | `CSSProperties` | — | Container style |

---

## Helpers

Lower-level functions for custom use cases:

```tsx
import {
  measureText,    // returns { lineCount, height }
  measureHeight,  // returns just the height number
  measureLines,   // returns per-line { text, width, start, end }
  prepareCached,  // cached prepare() call
  clearPreparedCache,
} from "@pretext-ui/react";

// Measure how tall "Hello world" will be at 300px wide
const height = measureHeight("Hello world", "16px sans-serif", 300, 24);
```

## Important: Font Matching

The `font` string you pass to components **must match your CSS exactly**. pretext uses it to look up glyph widths. If the font string doesn't match what's rendered, heights will be wrong.

```tsx
// CSS
.message { font: 16px Inter, sans-serif; line-height: 24px; }

// Component — must match
<VirtualList font="16px Inter, sans-serif" lineHeight={24} ... />
```

## Development

```bash
pnpm install
pnpm dev          # Start the kitchen sink demo
pnpm build        # Build library + demo
pnpm test         # Run tests
pnpm typecheck    # Type-check all packages
```

## Repo Structure

```
pretext-ui/
  packages/
    react/          # @pretext-ui/react — the component library
  apps/
    docs/           # Kitchen sink demo site (Vite + React + Tailwind)
```

## License

MIT
