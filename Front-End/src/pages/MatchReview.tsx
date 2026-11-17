import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Play, FileText, Crosshair, Dumbbell, RefreshCw, Download, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import { fmt } from "@/lib/utils";
import { categoryShare, categoryColor } from "@/data/mock";
import { Spinner, ErrorBox, Tabs, Bar, DemoBadge } from "@/components/ui";
import VideoPlayer, { PlayerHandle } from "@/components/VideoPlayer";
import MistakeCard from "@/components/MistakeCard";
import SummaryTab from "./tabs/SummaryTab";
import MistakesTab from "./tabs/MistakesTab";
import TrainingTab from "./tabs/TrainingTab";
import type { MatchReport } from "@/api/types";

export default function MatchReview() {
  const { id = "demo-1", tab = "analysis" } = useParams();
  const nav = useNavigate();
  const { data, error, loading, reload } = useAsync(() => api.getReport(id), [id]);
  const [activeId, setActiveId] = useState<string>("m1");
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [boxes, setBoxes] = useState(true);
  const player = useRef<PlayerHandle | null>(null);

  const mistakes = useMemo(() => data?.mistakes ?? [], [data]);
  const idx = Math.max(0, mistakes.findIndex((m) => m.id === activeId));
  const active = mistakes[idx];

  const jump = useCallback((mid: string, switchToAnalysis = false) => {
    const m = mistakes.find((x) => x.id === mid); if (!m) return;
    setActiveId(mid);
    if (switchToAnalysis && tab !== "analysis") nav(`/match/${id}/analysis`);
    setTimeout(() => player.current?.seek(m.start, true), switchToAnalysis ? 150 : 0);
  }, [mistakes, tab, nav, id]);
  const step = (d: number) => { const n = mistakes[(idx + d + mistakes.length) % mistakes.length]; if (n) jump(n.id); };
  const onTime = useCallback((t: number) => {
    setTime(t);
    const m = mistakes.find((x) => t >= x.start && t <= x.end);
    if (m) setActiveId((p) => (p === m.id ? p : m.id));
  }, [mistakes]);
  const onReady = useCallback((h: PlayerHandle) => { player.current = h; }, []);

  const exportReport = (r: MatchReport) => {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${r.match.filename}.report.json`; a.click();
  };

  if (loading) return <Spinner label="Loading match report…" />;
  if (error || !data) return <ErrorBox message={error ?? "Report not found"} onRetry={reload} />;
  const { match } = data;
  const breakdown = categoryShare.map((c) => ({ ...c, n: mistakes.filter((m) => m.category === c.name).length })).filter((c) => c.n > 0);
  const maxN = Math.max(1, ...breakdown.map((b) => b.n));

  return (
    <div>
      <div className="mb-3 text-sm text-zinc-400"><Link to="/analyze" className="hover:text-white">Analyze Video</Link> &gt; <span className="text-white">Analysis Results</span></div>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="grid h-14 w-24 place-items-center rounded-lg border border-line bg-zinc-900"><Play className="h-5 w-5 text-zinc-400" /></div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold">{match.filename}</h1>
          <div className="text-sm text-zinc-400">{match.map} • {fmt(match.duration)} • {match.resolution} {match.fps}fps</div>
        </div>
        <DemoBadge />
        <button className="btn" onClick={() => { setActiveId("m1"); player.current?.seek(0); }}><RefreshCw className="h-4 w-4" />Re-analyze <span className="text-[10px] text-zinc-500">(needs backend)</span></button>
        <button className="btn btn-primary" onClick={() => exportReport(data)}><Download className="h-4 w-4" />Export Report</button>
      </div>

      <Tabs value={tab} onChange={(t) => nav(`/match/${id}/${t}`)} tabs={[
        { id: "analysis", label: "Analysis", icon: <Play className="h-4 w-4" /> },
        { id: "summary", label: "Summary", icon: <FileText className="h-4 w-4" /> },
        { id: "mistakes", label: `Mistakes (${mistakes.length})`, icon: <Crosshair className="h-4 w-4" /> },
        { id: "training", label: "Training Plan", icon: <Dumbbell className="h-4 w-4" /> },
      ]} />

      <div className="mt-5">
        {tab === "analysis" && (
          <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
            <div className="min-w-0 space-y-4">
              <VideoPlayer src={match.videoUrl} mistakes={mistakes} activeId={activeId} showBoxes={boxes} onTime={onTime} onDuration={setDur} onReady={onReady} onNextMistake={() => step(1)} />
              <div className="flex items-center justify-between">
                <button className="btn" onClick={() => step(-1)}><ChevronLeft className="h-4 w-4" />Previous</button>
                <div className="flex items-center gap-4"><span className="font-semibold text-brand">Mistake {idx + 1} of {mistakes.length}</span>
                  <label className="flex items-center gap-2 text-xs text-zinc-400"><input type="checkbox" checked={boxes} onChange={(e) => setBoxes(e.target.checked)} />Bounding boxes</label></div>
                <button className="btn" onClick={() => step(1)}>Next<ChevronRight className="h-4 w-4" /></button>
              </div>
              {active && <div className="card p-4"><MistakeCard m={active} onPlay={() => jump(active.id)} /></div>}
              <div className="flex items-start gap-2 text-xs text-zinc-500"><Info className="h-4 w-4 shrink-0" />The video is a synthetic test pattern and all mistakes, boxes and advice are sample data. Real detection requires the FastAPI + YOLO/OpenCV worker.</div>
            </div>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="mb-3 text-lg font-bold">Overall Analysis</h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-28 w-28 shrink-0">
                    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a2a34" strokeWidth="3" /><circle cx="18" cy="18" r="15.9" fill="none" stroke="#ff4655" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${match.score} 100`} /></svg>
                    <div className="absolute inset-0 grid place-items-center text-center"><div><div className="text-3xl font-bold">{match.score}</div><div className="text-xs text-zinc-400">/100</div></div></div>
                  </div>
                  <div><div className="font-semibold">Gameplay Score</div><p className="text-sm text-zinc-400">Good aim and fights, but there are clear areas to improve, especially crosshair placement and positioning.</p></div>
                </div>
              </div>
              <div className="card p-5">
                <h3 className="mb-3 font-bold">Mistake Breakdown</h3>
                <div className="space-y-3">{breakdown.map((b) => (
                  <button key={b.name} className="flex w-full items-center gap-3 text-left text-sm hover:text-white" onClick={() => nav(`/match/${id}/mistakes?cat=${encodeURIComponent(b.name)}`)}>
                    <span className="w-40 shrink-0 text-zinc-300">{b.name}</span><Bar pct={(b.n / maxN) * 100} color={categoryColor[b.name]} /><span className="w-4">{b.n}</span>
                  </button>))}</div>
              </div>
              <div className="card p-5"><h3 className="mb-2 font-bold">Key Takeaway</h3><p className="text-sm text-zinc-300">{data.takeaway}</p>
                <button className="btn btn-primary mt-4 w-full" onClick={() => nav(`/match/${id}/training`)}>View Training Plan →</button></div>
            </div>
          </div>
        )}
        {tab === "summary" && <SummaryTab report={data} />}
        {tab === "mistakes" && <MistakesTab mistakes={mistakes} onJump={(mid) => jump(mid, true)} />}
        {tab === "training" && <TrainingTab />}
      </div>
    </div>
  );
}
