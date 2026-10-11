import Link from "next/link";
import SkillCatalog from "@/components/SkillCatalog";
import { getSkills } from "@/lib/skills";

export const metadata = {
  title: "Skills",
  description: "Small, readable agent skills for retries, engineering tradeoffs, and on-call. Take the instructions, inspect them, and make them yours.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  const skills = await getSkills();
  return <main className="mx-auto w-full max-w-4xl px-6 py-12 font-mono text-accent-soft sm:py-16">
    <nav className="mb-12 flex gap-6 text-xs uppercase tracking-[0.18em] text-accent-dim">
      <Link href="/" className="hover:text-accent">← /home</Link><Link href="/blog" className="hover:text-accent">/blog</Link>
    </nav>
    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent">~/skills · a small toolbox</p>
    <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">One job.<br />A little less friction.</h1>
    <p className="mt-6 max-w-2xl text-sm leading-7 text-accent-dim">Small skills for the engineering work between writing code and living with it. Each one gives your agent a narrow task, a few useful checks, and a clear place to stop.</p>
    <p className="mt-3 text-xs leading-6 text-accent-dim">Read every instruction here. Install one, or download the file into your agent’s skills folder. Free to use and adapt under MIT.</p>
    <SkillCatalog skills={skills} />
    <footer className="mt-12 border-t border-accent/15 pt-6 text-xs leading-6 text-accent-dim">Some start with an article. Others start with a small annoyance worth fixing. New skills earn their place by doing one useful thing.</footer>
  </main>;
}
