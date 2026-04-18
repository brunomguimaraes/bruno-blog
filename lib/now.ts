// Deterministic daily rotation for the now.log pane.
// Same date → same entries on server and client, so hydration stays clean.

export type NowKind = "ok" | "warn" | "err";

export type NowEntry = {
  kind: NowKind;
  text: string;
};

// The pool. Keep these short (one line feel), mix technical + personal,
// occasional GoG flavor. Add/remove freely — the picker just shuffles.
const POOL: NowEntry[] = [
  { kind: "ok",   text: "shipping this site & blog." },
  { kind: "ok",   text: "notes on calm on-call rotations." },
  { kind: "warn", text: "dependency audit queued." },
  { kind: "ok",   text: "weekend toy: a tiny typed event bus." },
  { kind: "err",  text: "still avoiding my linkedin photos." },
  { kind: "ok",   text: "reading: Designing Data-Intensive Applications, ch. 7." },
  { kind: "ok",   text: "refactoring a hot path from O(n²) to O(n log n)." },
  { kind: "warn", text: "a flaky test that only fails at 3am." },
  { kind: "ok",   text: "drafting a post on backpressure in Node streams." },
  { kind: "err",  text: "coffee budget exceeded for the month." },
  { kind: "ok",   text: "cleaning up 18 months of TODOs in an old repo." },
  { kind: "ok",   text: "pairing on a TypeScript migration — week 3 of 6." },
  { kind: "warn", text: "prod alert at lunch. misconfigured cron." },
  { kind: "ok",   text: "trying Bun for a side script. verdict: promising." },
  { kind: "ok",   text: "watching old Strange Loop talks." },
  { kind: "err",  text: "inbox at 47. claims it's fine. it isn't." },
  { kind: "ok",   text: "adding observability to a service I inherited." },
  { kind: "ok",   text: "cooking lessons from nonna. Rocket's helping. it's chaos." },
  { kind: "warn", text: "linter added 200 warnings overnight. fun morning." },
  { kind: "ok",   text: "writing better commit messages on purpose." },
  { kind: "ok",   text: "picking up Go again after a long break." },
  { kind: "ok",   text: "rethinking how I estimate — smaller slices, shipped faster." },
  { kind: "warn", text: "deprecation notice on a lib we rely on everywhere." },
  { kind: "ok",   text: "drafting the year-end retrospective post." },
  { kind: "ok",   text: "Groot is here. he's just standing there. menacingly." },
  { kind: "err",  text: "warp rain still not quite right on safari." },
  { kind: "ok",   text: "running again. slow miles, no watch." },
  { kind: "ok",   text: "testing a new blog workflow: mdx + front-matter tags." },
  { kind: "warn", text: "the flaky test came back. suspecting clock skew." },
  { kind: "ok",   text: "reading: The Pragmatic Programmer, anniversary edition." },
  { kind: "ok",   text: "building a tiny CLI for a friend's team." },
  { kind: "ok",   text: "cleaning my dotfiles (still a mess)." },
  { kind: "err",  text: "the gym habit this week: 2/4." },
  { kind: "ok",   text: "interviewing again. trying to be a better listener." },
  { kind: "ok",   text: "migrating a postgres schema without downtime. carefully." },
  { kind: "ok",   text: "writing tests for a bug nobody's reported yet." },
  { kind: "warn", text: "the dog ate a USB cable. data unharmed." },
  { kind: "ok",   text: "trying not to have opinions on whitespace this quarter." },
  { kind: "ok",   text: "making peace with the scrollbar." },
  { kind: "ok",   text: "Milano drydock: tuning the warp drive for safari." },
  { kind: "ok",   text: "reviewing a PR. one comment per file, max." },
  { kind: "warn", text: "a deploy rolled back itself. the canary did its job." },
  { kind: "ok",   text: "listening to lo-fi. writing a migration script." },
  { kind: "ok",   text: "saying no to meetings that could've been docs." },
];

// djb2 hash — stable across runtimes.
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

// Seeded Fisher-Yates using a linear congruential generator.
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

/**
 * Pick `n` entries deterministically for a given date string (YYYY-MM-DD).
 * Same input → same output, anywhere.
 */
export function pickForDate(dateStr: string, n = 5): NowEntry[] {
  const seed = djb2(dateStr);
  return seededShuffle(POOL, seed).slice(0, n);
}

/**
 * Today's `n` entries, using UTC so server + client agree.
 */
export function getTodayNow(n = 5): NowEntry[] {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC
  return pickForDate(today, n);
}
