import { Check, Target } from "lucide-react";
import type { Mistake } from "@/api/types";
import { categoryColor } from "@/data/mock";
import { fmt } from "@/lib/utils";
import { SevBadge } from "./ui";

export default function MistakeCard({ m, onPlay }: { m: Mistake; onPlay?: () => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-[auto_1fr_1fr]">
      <button onClick={onPlay} className="relative hidden h-24 w-40 items-center justify-center rounded-lg border border-brand/70 bg-zinc-900 md:flex" aria-label="Jump to timestamp">
        <span className="rounded-full bg-black/60 p-3">▶</span>
        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 text-xs">{fmt(m.start)}</span>
      </button>
      <div>
        <div className="flex items-center gap-2"><Target className="h-5 w-5" style={{ color: categoryColor[m.category] }} /><b>{m.category}</b><SevBadge s={m.severity} /></div>
        <div className="mt-1 text-xs text-zinc-400">{fmt(m.start)} – {fmt(m.end)} · {m.title}</div>
        <p className="mt-2 text-sm text-zinc-300">{m.explanation}</p>
      </div>
      <div className="md:border-l md:border-line md:pl-4">
        <div className="mb-1 text-sm font-semibold text-brand">How to Improve</div>
        <ul className="space-y-1 text-sm text-zinc-300">{m.tips.map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{t}</li>)}</ul>
      </div>
    </div>
  );
}
