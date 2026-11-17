import { Link, useNavigate } from "react-router-dom";
import { Layers, AlertTriangle, Target, Flame, Play, Upload } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import { categoryShare, mockDrills } from "@/data/mock";
import { fmt } from "@/lib/utils";
import { Spinner, ErrorBox, DemoBadge } from "@/components/ui";

export default function Dashboard() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useAsync(() => api.listMatches());
  const stats = [
    { l: "Matches Reviewed", v: "24", s: "+6 this week", i: Layers, c: "border-brand/50 from-brand/20" },
    { l: "Mistakes Found", v: "137", s: "−18% vs. last week", i: AlertTriangle, c: "border-teal-400/50 from-teal-400/15" },
    { l: "Focus Score", v: "72 / 100", s: "+8 pts vs. last week", i: Target, c: "border-violet-500/50 from-violet-500/15" },
    { l: "Training Streak", v: "5 days", s: "Best: 12 days", i: Flame, c: "border-orange-500/50 from-orange-500/15" },
  ];
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Welcome back, Player!</h1><p className="text-sm text-zinc-400">Your AI tactical-FPS coach for smarter gameplay, fewer mistakes, and faster improvement.</p></div>
        <div className="flex items-center gap-2"><DemoBadge /><button className="btn" onClick={() => nav("/analyze")}><Play className="h-4 w-4" />Analyze Video</button><button className="btn btn-primary" onClick={() => nav("/analyze")}><Upload className="h-4 w-4" />Upload & Analyze</button></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className={`flex items-center gap-4 rounded-xl border bg-gradient-to-br to-panel p-5 ${s.c}`}>
            <s.i className="h-9 w-9 opacity-80" /><div><div className="text-sm">{s.l}</div><div className="text-3xl font-bold">{s.v}</div><div className="text-xs text-zinc-400">{s.s}</div></div>
          </div>))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="card p-5">
          <div className="mb-3 flex justify-between"><h3 className="font-bold">Recent Match Reviews</h3><Link className="text-sm text-brand" to="/history">View All →</Link></div>
          {loading ? <Spinner /> : error || !data ? <ErrorBox message={error ?? "Failed"} onRetry={reload} /> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="text-left text-xs text-zinc-500"><tr><th className="py-2">Match</th><th>Result</th><th>Focus Score</th><th>Mistakes</th><th>Reviewed</th></tr></thead>
              <tbody>{data.map((m) => (
                <tr key={m.id} className="cursor-pointer border-t border-line hover:bg-white/5" onClick={() => nav(`/match/${m.id}`)}>
                  <td className="py-3"><div className="font-semibold">{m.filename}</div><div className="text-xs text-zinc-500">{m.mode} • {m.map} • {fmt(m.duration)}</div></td>
                  <td><span className={`rounded px-2 py-1 text-xs ${m.result === "Victory" ? "bg-green-500/15 text-green-400" : "bg-brand/15 text-brand"}`}>{m.result}</span></td>
                  <td className="font-semibold">{m.score} <span className="text-zinc-500">/ 100</span></td><td className="font-semibold text-brand">{m.mistakeCount}</td><td className="text-zinc-400">{m.reviewedAt}</td></tr>))}</tbody>
            </table></div>)}
        </div>
        <div className="space-y-5">
          <div className="card p-5"><h3 className="mb-2 font-bold">Top Mistake Categories</h3>
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-40 shrink-0"><ResponsiveContainer><PieChart><Pie data={categoryShare} dataKey="value" innerRadius={52} outerRadius={72} stroke="none">{categoryShare.map((c) => <Cell key={c.name} fill={c.color} />)}</Pie></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-2xl font-bold">137</div><div className="text-xs text-zinc-400">Mistakes</div></div></div></div>
              <ul className="flex-1 space-y-2 text-sm">{categoryShare.map((c) => <li key={c.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} /><span className="flex-1">{c.name}</span>{c.value}%</li>)}</ul>
            </div></div>
          <div className="card p-5"><div className="mb-2 flex justify-between"><h3 className="font-bold">This Week's Focus</h3><span className="rounded border border-teal-400/50 px-2 py-0.5 text-xs text-teal-300">Sample insight</span></div>
            <b>Improve Crosshair Placement</b><p className="my-2 text-sm text-zinc-400">35% of your mistakes this week were due to crosshair placement. Keep your crosshair at head level and pre-aim common angles.</p>
            <button className="btn w-full border-brand text-brand" onClick={() => nav("/match/demo-1/training")}>View Training Plan →</button></div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="flex flex-wrap items-center gap-5 rounded-xl border border-brand/40 bg-gradient-to-br from-brand/20 to-panel p-6">
          <div className="min-w-[200px] flex-1"><h3 className="text-xl font-bold">Quick Start</h3><p className="text-sm text-zinc-300">Analyze a new match and get mistake breakdowns and a personalized training plan.</p></div>
          <button onClick={() => nav("/analyze")} className="rounded-lg border-2 border-dashed border-zinc-600 p-5 text-center text-sm hover:border-brand"><Upload className="mx-auto mb-1 h-6 w-6" /><b>Upload Match Video</b><div className="text-xs text-zinc-500">MP4, MOV, MKV, AVI, WEBM</div></button>
          <button className="btn btn-primary" onClick={() => nav("/analyze")}><Play className="h-4 w-4" />Analyze Video</button>
        </div>
        <div className="card p-5"><div className="mb-2 flex justify-between"><h3 className="font-bold">Latest Training Recommendations</h3><Link to="/match/demo-1/training" className="text-sm text-brand">View All →</Link></div>
          {mockDrills.slice(0, 3).map((d) => <div key={d.id} className="flex items-center gap-3 border-t border-line py-2 text-sm"><div className="flex-1"><b>{d.title}</b><div className="text-xs text-zinc-500">{d.description}</div></div><span className="rounded border border-line px-2 py-1 text-xs">{d.minutes} min</span></div>)}</div>
      </div>
    </div>
  );
}
