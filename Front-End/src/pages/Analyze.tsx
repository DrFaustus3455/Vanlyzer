import { useEffect, useRef, useState, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, FolderOpen, Info, X, CheckCircle2 } from "lucide-react";
import { api, USE_MOCK } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import type { AnalysisOptions, Match, AnalysisJob } from "@/api/types";
import { cn } from "@/lib/utils";
import { PageHeader, DemoBadge, Toggle, Tabs, Spinner } from "@/components/ui";

const EXT = ["mp4", "mkv", "mov", "avi", "webm"];
const MAX_GB = 8;
const validate = (f: File) => {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EXT.includes(ext)) return `Unsupported format .${ext}. Use ${EXT.join(", ")}.`;
  if (f.size > MAX_GB * 1024 ** 3) return `File exceeds ${MAX_GB} GB.`;
  if (f.size === 0) return "File is empty.";
  return null;
};

export default function Analyze() {
  const nav = useNavigate();
  const [tab, setTab] = useState("upload");
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pct, setPct] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<Match | null>(null);
  const [job, setJob] = useState<AnalysisJob | null>(null);
  const [opts, setOpts] = useState<AnalysisOptions>({ focus: "overall", detail: "standard", detectMistakes: true, trainingPlan: true });
  const abort = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const { data: recent } = useAsync(() => api.listMatches());

  const pick = (f?: File) => { if (!f) return; const e = validate(f); setErr(e); if (!e) { setFile(f); setUploaded(null); setJob(null); setPct(0); } };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); };
  const preview = file ? URL.createObjectURL(file) : null;
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const upload = async () => {
    if (!file) return; setUploading(true); setErr(null); abort.current = new AbortController();
    try { setUploaded(await api.uploadVideo(file, setPct, abort.current.signal)); }
    catch (e: any) { setErr(e?.name === "AbortError" || e?.name === "CanceledError" ? "Upload cancelled." : e?.message ?? "Upload failed"); }
    finally { setUploading(false); }
  };
  const analyze = async () => {
    if (!uploaded) return; setTab("queue");
    try {
      let j = await api.startAnalysis(uploaded.id, opts); setJob(j);
      while (j.status !== "complete" && j.status !== "failed") { await new Promise((r) => setTimeout(r, 600)); j = await api.getJob(j.id); setJob(j); }
    } catch (e: any) { setErr(e?.message ?? "Analysis failed"); }
  };
  const Seg = <K extends "focus" | "detail">(k: K, items: [AnalysisOptions[K], string][]) => (
    <div className="flex flex-wrap gap-2">{items.map(([v, l]) => <button key={v} className={cn("chip", opts[k] === v && "chip-on")} onClick={() => setOpts({ ...opts, [k]: v })}>{l}</button>)}</div>);

  return (
    <div>
      <PageHeader title="Analyze Video" sub="Upload a recorded match to get play analysis, mistakes, and coaching." right={<DemoBadge />} />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "upload", label: "Upload or Select Match" }, { id: "queue", label: `Analysis Queue (${job ? 1 : 0})` }, { id: "results", label: "Analysis Results" }]} />
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          {tab === "upload" && (<>
            <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
              className={cn("rounded-xl border-2 border-dashed p-10 text-center", drag ? "border-brand bg-brand/10" : "border-brand/60 bg-panel")}>
              <CloudUpload className="mx-auto h-14 w-14 text-brand" /><div className="mt-3 text-xl font-bold">Drag & drop a match video here</div>
              <div className="my-2 text-xs text-zinc-500">or</div>
              <button className="btn border-brand text-brand" onClick={() => input.current?.click()}><FolderOpen className="h-4 w-4" />Choose File</button>
              <input ref={input} type="file" hidden accept=".mp4,.mkv,.mov,.avi,.webm,video/*" onChange={(e) => pick(e.target.files?.[0])} />
              <div className="mt-3 text-xs text-zinc-400">Max file size: {MAX_GB} GB · Formats: {EXT.join(", ").toUpperCase()}</div>
            </div>
            {err && <div role="alert" className="rounded-lg border border-brand/50 bg-brand/10 p-3 text-sm text-brand">{err}</div>}
            {file && preview && (
              <div className="card grid gap-4 p-4 md:grid-cols-[280px_1fr]">
                <video src={preview} controls className="aspect-video w-full rounded-lg bg-black" />
                <div className="space-y-3">
                  <div className="flex justify-between"><div><b>{file.name}</b><div className="text-xs text-zinc-400">{(file.size / 1024 ** 2).toFixed(1)} MB</div></div>
                    <button aria-label="Remove" onClick={() => { abort.current?.abort(); setFile(null); setUploaded(null); setPct(0); }}><X className="h-4 w-4" /></button></div>
                  {(uploading || uploaded) && <div><div className="mb-1 flex justify-between text-xs"><span>{uploaded ? "Upload complete" : "Uploading…"}</span><span>{pct}%</span></div><div className="h-2 rounded-full bg-zinc-800"><div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} /></div></div>}
                  <div className="flex gap-2">{!uploaded && <button className="btn btn-primary" disabled={uploading} onClick={upload}>{uploading ? "Uploading…" : USE_MOCK ? "Add to library (demo)" : "Upload"}</button>}
                    {uploading && <button className="btn" onClick={() => abort.current?.abort()}>Cancel</button>}</div>
                </div>
              </div>)}
          </>)}
          {tab === "queue" && (job ? (
            <div className="card p-6"><div className="mb-2 flex justify-between"><b>{uploaded?.filename}</b><span className="text-sm text-zinc-400">{job.stage}</span></div>
              <div className="h-3 rounded-full bg-zinc-800"><div className="h-3 rounded-full bg-brand transition-all" style={{ width: `${job.progress}%` }} /></div>
              <div className="mt-2 text-sm text-zinc-400">{job.progress}%</div>
              {USE_MOCK && <p className="mt-3 flex gap-2 text-xs text-amber-400"><Info className="h-4 w-4 shrink-0" />Demo mode: this progress bar is simulated. Your video is not being analyzed, and results will show sample data.</p>}
              {job.status === "complete" && <button className="btn btn-primary mt-4" onClick={() => { setTab("results"); }}><CheckCircle2 className="h-4 w-4" />View results</button>}</div>
          ) : <div className="card p-8 text-center text-sm text-zinc-400">No jobs in the queue. Upload a video and press Analyze Now.</div>)}
          {tab === "results" && (<div className="card p-6"><b>Recent results</b>{!recent ? <Spinner /> : recent.map((m) => <button key={m.id} className="flex w-full justify-between border-t border-line py-3 text-left text-sm hover:text-brand" onClick={() => nav(`/match/${m.id}`)}><span>{m.filename}</span><span>{m.score}/100</span></button>)}</div>)}

          <div className="card p-5"><div className="mb-2 flex justify-between"><b>Your Recent Videos ({recent?.length ?? 0})</b><button className="text-sm text-brand" onClick={() => nav("/history")}>View All in History →</button></div>
            {recent?.slice(0, 4).map((m) => <div key={m.id} className="flex items-center gap-3 border-t border-line py-2 text-sm"><div className="flex-1"><b>{m.filename}</b><div className="text-xs text-zinc-500">{m.map}</div></div><span className="rounded-full border border-green-500/50 px-3 py-1 text-xs text-green-400">Analysis Complete (sample)</span><button className="btn !py-1" onClick={() => nav(`/match/${m.id}`)}>Open</button></div>)}</div>
        </div>
        <div className="space-y-5">
          <div className="card p-5"><h3 className="mb-3 font-bold">Analysis Pipeline</h3><ol className="grid grid-cols-4 gap-2 text-center text-xs">{["Upload", "Detect", "Review", "Coach"].map((s, i) => <li key={s}><div className="mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-brand text-brand">{i + 1}</div><b>{s}</b></li>)}</ol></div>
          <div className="card space-y-4 p-5"><h3 className="font-bold">Processing Options</h3>
            <div><div className="mb-2 text-sm">Analysis Focus</div>{Seg("focus", [["overall", "Overall"], ["aim", "Aim & Fights"], ["utility", "Utility"], ["positioning", "Positioning"]])}</div>
            <div><div className="mb-2 text-sm">Detail Level</div>{Seg("detail", [["quick", "Quick (~2 min)"], ["standard", "Standard (~4 min)"], ["indepth", "In-Depth (~6+ min)"]])}</div>
            <div className="flex items-center justify-between text-sm">Detect Mistakes & Missed Opportunities<Toggle label="Detect mistakes" on={opts.detectMistakes} onChange={(v) => setOpts({ ...opts, detectMistakes: v })} /></div>
            <div className="flex items-center justify-between text-sm">Generate Personalized Training Plan<Toggle label="Training plan" on={opts.trainingPlan} onChange={(v) => setOpts({ ...opts, trainingPlan: v })} /></div>
            <button className="btn btn-primary w-full !py-3 text-base" disabled={!uploaded || !!job && job.status !== "complete"} onClick={analyze}>Analyze Now</button>
            <p className="text-center text-xs text-zinc-500">{uploaded ? "Ready to analyze." : "Upload a video first."}</p></div>
        </div>
      </div>
    </div>
  );
}
