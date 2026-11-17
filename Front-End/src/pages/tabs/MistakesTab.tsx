import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import type { Mistake } from "@/api/types";
import { categoryShare, categoryColor } from "@/data/mock";
import { fmt, cn } from "@/lib/utils";
import { SevBadge } from "@/components/ui";
import EvidenceFrame from "@/components/EvidenceFrame";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";

export default function MistakesTab({ mistakes, onJump }: { mistakes: Mistake[]; onJump: (id: string) => void }) {
  const { id = "demo-1" } = useParams();
  const [sp, setSp] = useSearchParams();
  const cat = sp.get("cat") ?? "All";
  const [sev, setSev] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const { data: report } = useAsync(() => api.getReport(id), [id]);
  const src = report?.match.videoUrl ?? "/demo.mp4";
  const list = useMemo(() => mistakes.filter((m) => (cat === "All" || m.category === cat) && (sev === "All" || m.severity === sev) && (m.title + m.explanation).toLowerCase().includes(q.toLowerCase())), [mistakes, cat, sev, q]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mistakes" className="rounded-lg border border-line bg-panel py-2 pl-8 pr-3 text-sm outline-none focus:border-brand" /></div>
        {["All", ...categoryShare.map((c) => c.name)].map((c) => <button key={c} className={cn("chip", cat === c && "chip-on")} onClick={() => setSp(c === "All" ? {} : { cat: c })}>{c}</button>)}
        <span className="mx-1 text-zinc-600">|</span>
        {["All", "High", "Medium", "Low"].map((s) => <button key={s} className={cn("chip", sev === s && "chip-on")} onClick={() => setSev(s)}>{s}</button>)}
      </div>
      {list.length === 0 && <div className="card p-8 text-center text-sm text-zinc-400">No mistakes match these filters.</div>}
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className="card p-4">
            <div className="grid items-start gap-4 md:grid-cols-[200px_1fr_auto]">
              <EvidenceFrame src={src} t={m.start} box={m.bbox} />
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor[m.category] }} /><b>{m.title}</b><SevBadge s={m.severity} /><span className="text-xs text-zinc-500">{fmt(m.start)}–{fmt(m.end)}</span></div>
                <div className="text-xs text-zinc-400">{m.category}</div>
                <p className="mt-2 text-sm text-zinc-300">{m.explanation}</p>
                {open === m.id && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">{m.tips.map((t) => <li key={t}>{t}</li>)}</ul>}
              </div>
              <div className="flex gap-2 md:flex-col">
                <button className="btn btn-primary" onClick={() => onJump(m.id)}>Watch clip</button>
                <button className="btn" onClick={() => setOpen(open === m.id ? null : m.id)}>{open === m.id ? "Hide tips" : "How to improve"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
