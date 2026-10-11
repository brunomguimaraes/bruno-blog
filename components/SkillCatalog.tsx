"use client";

import Link from "next/link";
import { useState } from "react";
import type { Skill } from "@/lib/skills";

export default function SkillCatalog({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [notice, setNotice] = useState("");
  const categories = ["all", ...new Set(skills.map((s) => s.category))];
  const filtered = skills.filter((s) => (category === "all" || s.category === category) &&
    `${s.title} ${s.slug} ${s.summary} ${s.description}`.toLowerCase().includes(query.trim().toLowerCase()));

  async function copy(slug: string) {
    try {
      await navigator.clipboard.writeText(`npx skills add brunomguimaraes/bruno-blog --skill ${slug}`);
      setNotice(`Install command copied for ${slug}.`);
    } catch {
      setNotice("Clipboard unavailable. Select and copy the command below.");
    }
  }

  return <>
    <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <label className="block text-xs text-accent-dim sm:w-80">
        Find a skill
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Retries, dependencies, on-call…"
          className="mt-2 w-full rounded-md border border-accent/25 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-accent-dim/60 focus:outline focus:outline-2 focus:outline-accent" />
      </label>
      <div className="flex flex-wrap gap-2" aria-label="Filter skills by category">
        {categories.map((c) => <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={c === category}
          className={`rounded border px-3 py-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${c === category ? "border-accent/60 bg-accent/10 text-accent" : "border-accent/15 text-accent-dim hover:border-accent/40"}`}>{c}</button>)}
      </div>
    </div>
    <div className="my-4 flex min-h-6 flex-wrap justify-between gap-2 text-xs text-accent-dim" aria-live="polite">
      <span>{filtered.length} {filtered.length === 1 ? "skill" : "skills"}</span><span>{notice}</span>
    </div>
    <div className="space-y-5">
      {filtered.map((skill, index) => <article id={skill.slug} key={skill.slug} className="scroll-mt-8 rounded-lg border border-accent/20 bg-[#050d1d] p-5 sm:p-7">
        <div className="mb-4 flex justify-between text-[11px] uppercase tracking-widest text-accent-dim">
          <span>{String(index + 1).padStart(2, "0")} / {skill.category}</span><span>one job · plain markdown</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{skill.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-accent-soft">{skill.summary}</p>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-accent-dim">{skill.description}</p>
        <div className="mt-5 flex flex-col gap-3 rounded border border-accent/15 bg-black/30 p-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 break-words text-xs leading-6 text-accent">npx skills add brunomguimaraes/bruno-blog --skill {skill.slug}</code>
          <button type="button" className="btn shrink-0 self-start" onClick={() => copy(skill.slug)} aria-label={`Copy install command for ${skill.title}`}>copy install</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs">
          <a className="link" href={`/skills/${skill.slug}/SKILL.md`} download="SKILL.md">download SKILL.md ↓</a>
          <a className="link" href={`https://github.com/brunomguimaraes/bruno-blog/tree/main/skills/${skill.slug}`} target="_blank" rel="noreferrer">source ↗</a>
          {skill.relatedPost && <Link className="link" href={`/blog/${skill.relatedPost}`}>the related article →</Link>}
        </div>
        <details className="mt-5 border-t border-accent/15 pt-4 text-xs">
          <summary className="cursor-pointer text-accent-dim hover:text-accent">Read the instructions · updated {skill.updated}</summary>
          <pre className="mt-4 whitespace-pre-wrap break-words leading-6 text-accent-soft">{skill.source}</pre>
        </details>
      </article>)}
      {!filtered.length && <p className="rounded-lg border border-dashed border-accent/25 p-8 text-sm text-accent-dim">No skills match that search. Try another word or choose “all”.</p>}
    </div>
  </>;
}
