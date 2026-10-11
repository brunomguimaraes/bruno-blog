import { getSkills } from "@/lib/skills";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getSkills()).map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = (await getSkills()).find((s) => s.slug === slug);
  if (!skill) return new Response("Skill not found", { status: 404 });
  return new Response(skill.source, { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    "Content-Disposition": 'attachment; filename="SKILL.md"',
    "X-Content-Type-Options": "nosniff",
  } });
}
