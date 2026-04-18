# bruno-blog

Personal portfolio + blog. Matrix-but-blue aesthetic with a tiled "tmux workspace" layout. Real canvas-based rain in the hero pane. **13 hidden features** to discover.

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
  MatrixRain.tsx       canvas rain scoped to the hero pane
  HomePage.tsx         the Mix-C tiled hero layout
  StatusBar.tsx        top bar with clock + rain state + egg counter
  CommandBar.tsx       bottom bar with shortcut hints
  GlobalShell.tsx      client boundary that mounts the EasterEggsProvider
  GlitchText.tsx       data-text clone trick for cyan chromatic fringe
  Panes.tsx            whoami / now / blog-list / contact / root pane
  easter-eggs/
    context.ts         createContext + useEasterEggs hook
    provider.tsx       state, keydown dispatcher, command runner
    config.ts          EGGS + palette COMMANDS
    HelpOverlay.tsx    ? -toggle overlay listing discovered eggs
    CommandPalette.tsx Cmd/Ctrl+K fuzzy palette
    QuakeTerminal.tsx  drop-down shell with real commands
    Screensaver.tsx    idle-60s fullscreen rain takeover
    CyberterrorAlert.tsx  red ACCESS DENIED flash
    ToastHost.tsx      discovery + confirmation toasts
    hooks.ts           useKonami, useTypedWords, useIdle, useVimEscape
lib/
  posts.ts             MDX file reader (frontmatter + body)
content/
  posts/*.mdx          starter blog posts
```

## Hidden features (spoilers — collect them all from the site instead)

Press `?` in the running app to see a live list of what you've found. The site intentionally obscures undiscovered entries.

| Trigger | Feature |
| --- | --- |
| `?` | Help overlay (lists what you've found) |
| `⌘K` / `Ctrl+K` | Command palette — run any feature by name |
| `` Ctrl+` `` or `` ` `` | Quake drop-down terminal (with real commands) |
| `Tab` then `Enter` | Cycle pane focus, then tmux-zoom it |
| click pulse dot | Rain: forward → paused → reverse |
| click the hero title | Storm — 2× speed for 5s |
| Konami code `↑↑↓↓←→←→BA` | Anomaly mode (OG matrix green bleeds through) |
| type `matrix` | Rain storm (anywhere on the page) |
| type `rabbit` | "follow the white rabbit…" |
| type `wake` | "Wake up, Neo…" |
| quake → `touch /root` | Cyberterror red alert — ACCESS DENIED |
| quake → `rm -rf /` | Also trips the alarm |
| `:q` / `:wq` | Cheeky vim quit toast |
| idle for 60 seconds | Screensaver — pure rain takeover |

## Deploy

The easiest path is Vercel:

1. Push this repo to GitHub.
2. Import it on <https://vercel.com/new>.
3. Accept the defaults — Vercel auto-detects Next.js.

## Credits

Designed + coded by Bruno Guimaraes. Rain inspired by the original Matrix effect, in blue.
