# bruno-blog

Personal portfolio + blog. Space-outlaw terminal UI with a tiled "tmux workspace" layout — the bridge, in blue. Real canvas-based warp rain in the hero pane. **20 hidden features** to discover, a few of which would only show up on a senior-frontend code review.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript strict mode
- Tailwind CSS 3
- MDX blog posts via `next-mdx-remote` + `gray-matter`
- Self-hosted JetBrains Mono via `next/font/google`

## Getting started

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — Next.js ESLint
- `pnpm typecheck` — tsc --noEmit

## Project layout

```
app/
  layout.tsx           root layout, wraps everything in <GlobalShell/>
  page.tsx             home page — renders <HomePage/>
  globals.css          design-system CSS (tiles, glitch, scan, rain, eggs)
  blog/
    page.tsx           blog index
    [slug]/page.tsx    MDX post rendering (server component)
components/
  MatrixRain.tsx       canvas warp-rain scoped to the hero pane
  HomePage.tsx         the tiled hero layout
  StatusBar.tsx        top bar with clock + warp state + egg counter
  CommandBar.tsx       bottom bar with shortcut hints
  GlobalShell.tsx      client boundary that mounts the EasterEggsProvider
  GlitchText.tsx       data-text clone trick for cyan chromatic fringe
  Panes.tsx            whoami / now / blog-list / contact / hollow pane
  easter-eggs/
    context.ts         createContext + useEasterEggs hook
    provider.tsx       state, keydown dispatcher, command runner
    config.ts          EGGS + palette COMMANDS
    HelpOverlay.tsx    ? -toggle bridge manual overlay
    CommandPalette.tsx Cmd/Ctrl+K ship's controls palette
    QuakeTerminal.tsx  drop-down bridge console (with real commands)
    Screensaver.tsx    idle-60s deep space drift
    CyberterrorAlert.tsx  Breach Wave red alert
    ToastHost.tsx      discovery + confirmation toasts
    hooks.ts           useKonami, useTypedWords, useIdle, useVimEscape
lib/
  posts.ts             MDX file reader (frontmatter + body)
content/
  posts/*.mdx          starter blog posts
```

## Hidden features (spoilers — collect them all from the site instead)

Press `?` in the running app to see the live bridge manual — it obscures undiscovered entries.

| Trigger | Feature |
| --- | --- |
| `?` | Bridge manual (lists what you've found) |
| `⌘K` / `Ctrl+K` | Ship's controls — run any feature by name |
| `` ` `` | Bridge console (drop-down, with real commands) |
| `Tab` then `Enter` | Cycle pane focus, then bridge-zoom it (View Transitions API) |
| click pulse dot | Warp drive: forward → paused → reverse |
| click the hero title | Storm — 2× speed for 5s |
| Konami code `↑↑↓↓←→←→BA` | Anomaly mode (green bleeds through the blue) |
| type `storm` | "Boom. Weapons free." — 5s storm |
| type `verdant` | Toggles the anomaly |
| type `captain` | A legendary outlaw checks in |
| type `stowaway` | Logs a find from the HTML comment in view-source |
| console → `touch /hollow` | Dock at the hollowed husk |
| console → `alarm` or `rm -rf /` | Breach Wave — shields up |
| `:q` / `:wq` | Cheeky vim quit toast |
| idle for 60 seconds | Deep space drift — screensaver takeover |
| open DevTools | ASCII bridge banner + `window.bruno` debug API |
| save-data / reduce-motion | Adaptive warp (rain slows to 2–6fps) |
| read a post to the end | Scroll-driven progress bar + "end of log" toast |
| open a second tab | Parallel bridge — eggs + warp sync via BroadcastChannel |
| plug in a gamepad | Pilot mode — D-pad panes · A palette · Y storm · B alarm |
| drag the column gutter | Reconfigure bulkheads — layout saved to the URL hash |

## Deploy

The easiest path is Vercel:

1. Push this repo to GitHub.
2. Import it on <https://vercel.com/new>.
3. Accept the defaults — Vercel auto-detects Next.js.

## Credits

Designed + coded by Bruno Guimaraes. Warp rain inspired by the original Matrix effect, blued out and rethemed as a ship's bridge. The whole thing is a loving homage to classic space-outlaw comics — any resemblance to specific characters, places, or events is deliberately kept at the "if you know, you know" level.
