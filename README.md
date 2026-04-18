# bruno-blog

Personal portfolio + blog. Guardians-of-the-Galaxy-comics-flavored terminal UI with a tiled "tmux workspace" layout — the Milano bridge, in blue. Real canvas-based warp rain in the hero pane. **13 hidden features** to discover.

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
  HomePage.tsx         the Mix-C tiled hero layout
  StatusBar.tsx        top bar with clock + warp state + egg counter
  CommandBar.tsx       bottom bar with shortcut hints
  GlobalShell.tsx      client boundary that mounts the EasterEggsProvider
  GlitchText.tsx       data-text clone trick for cyan chromatic fringe
  Panes.tsx            whoami / now / blog-list / contact / knowhere pane
  easter-eggs/
    context.ts         createContext + useEasterEggs hook
    provider.tsx       state, keydown dispatcher, command runner
    config.ts          EGGS + palette COMMANDS
    HelpOverlay.tsx    ? -toggle Milano manual overlay
    CommandPalette.tsx Cmd/Ctrl+K ship's controls palette
    QuakeTerminal.tsx  drop-down Milano console (with real commands)
    Screensaver.tsx    idle-60s deep space drift
    CyberterrorAlert.tsx  Annihilation Wave red alert
    ToastHost.tsx      discovery + confirmation toasts
    hooks.ts           useKonami, useTypedWords, useIdle, useVimEscape
lib/
  posts.ts             MDX file reader (frontmatter + body)
content/
  posts/*.mdx          starter blog posts
```

## Hidden features (spoilers — collect them all from the site instead)

Press `?` in the running app to see the live Milano manual — it obscures undiscovered entries.

| Trigger | Feature |
| --- | --- |
| `?` | Milano manual (lists what you've found) |
| `⌘K` / `Ctrl+K` | Ship's controls — run any feature by name |
| `` Ctrl+` `` or `` ` `` | Milano console (drop-down, with real commands) |
| `Tab` then `Enter` | Cycle pane focus, then bridge-zoom it |
| click pulse dot | Warp drive: forward → paused → reverse |
| click the hero title | Rocket storm — 2× speed for 5s |
| Konami code `↑↑↓↓←→←→BA` | I AM GROOT (green bleeds through the blue) |
| type `rocket` | "Blam! Murdered you!" — 5s storm |
| type `groot` | I am Groot. |
| type `quill` | Star-Lord checks in |
| console → `touch /knowhere` | Dock at the celestial head |
| console → `alarm` or `rm -rf /` | Annihilation Wave — shields up |
| `:q` / `:wq` | Cheeky vim quit toast |
| idle for 60 seconds | Deep space drift — screensaver takeover |

## Deploy

The easiest path is Vercel:

1. Push this repo to GitHub.
2. Import it on <https://vercel.com/new>.
3. Accept the defaults — Vercel auto-detects Next.js.

## Credits

Designed + coded by Bruno Guimaraes. Warp rain inspired by the original Matrix effect, blued out and rethemed as the Milano bridge. Rocket, Groot, Star-Lord, Knowhere, and the Annihilation Wave are Marvel characters/concepts — referenced in loving homage to the GoG comics run.
