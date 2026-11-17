import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download } from "lucide-react";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import { PageHeader, Spinner, ErrorBox, DemoBadge } from "@/components/ui";
import { fmt, cn } from "@/lib/utils";

export default function History() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useAsync(() => api.listMatches());
  const [q, setQ] = useState(""); const [res, setRes] = useState("All"); const [sort, setSort] = useState("recent");
  const list = useMemo(() => {
    const l = (data ?? []).filter((m) => (res === "All" || m.result === res) && `${m.filename} ${m.map}`.toLowerCase().includes(q.toLowerCase()));
    return sort === "score" ? [...l].sort((a, b) => b.score - a.score) : sort === "mistakes" ? [...l].sort((a, b) => b.mistakeCount - a.mistakeCount) : l;
  }, [data, q, res, sort]);
  return (
    <div>
      <PageHeader title="History" sub="Search previous matches and reports." right={<DemoBadge />} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative"><Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-500" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or map" className="rounded-lg border border-line bg-panel py-2 pl-8 pr-3 text-sm outline-none focus:border-brand" /></div>
        {["All", "Victory", "Defeat"].map((r) => <button key={r} className={cn("chip", res === r && "chip-on")} onClick={() => setRes(r)}>{r}</button>)}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-line bg-panel px-3 py-2 text-sm"><option value="recent">Most recent</option><option value="score">Highest score</option><option value="mistakes">Most mistakes</option></select>
      </div>
      {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : list.length === 0 ? <div className="card p-8 text-center text-sm text-zinc-400">No matches found.</div> : (
        <div className="card divide-y divide-line">{list.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-4 p-4 text-sm">
            <div className="min-w-[180px] flex-1"><b>{m.filename}</b><div className="text-xs text-zinc-500">{m.map} • {fmt(m.duration)} • {m.reviewedAt}</div></div>
            <span className={m.result === "Victory" ? "text-green-400" : "text-brand"}>{m.result}</span><span>{m.score}/100</span><span className="text-brand">{m.mistakeCount} mistakes</span>
            <button className="btn" onClick={() => nav(`/match/${m.id}`)}>Open report</button>
            <button className="btn" aria-label="Download report" onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(m, null, 2)])); a.download = `${m.filename}.json`; a.click(); }}><Download className="h-4 w-4" /></button>
          </div>))}</div>)}
    </div>
  );
}
