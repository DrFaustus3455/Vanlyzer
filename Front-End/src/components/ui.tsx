import { ReactNode } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { USE_MOCK } from "@/api/client";

export const Spinner = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-2 p-12 text-sm text-zinc-400"><Loader2 className="h-4 w-4 animate-spin" />{label}</div>
);
export const ErrorBox = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="card flex items-center gap-3 border-brand/40 p-6 text-sm"><AlertTriangle className="h-5 w-5 text-brand" /><span className="flex-1">{message}</span>{onRetry && <button className="btn" onClick={onRetry}>Retry</button>}</div>
);
export const DemoBadge = () => USE_MOCK ? (
  <span className="rounded-md bg-brand/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white" title="No backend connected. All data is sample data.">Demo data</span>
) : null;
export const Tabs = ({ tabs, value, onChange }: { tabs: { id: string; label: string; icon?: ReactNode }[]; value: string; onChange: (id: string) => void }) => (
  <div className="flex gap-2 overflow-x-auto border-b border-line">
    {tabs.map((t) => (
      <button key={t.id} onClick={() => onChange(t.id)} className={cn("flex items-center gap-2 whitespace-nowrap rounded-t-lg border border-b-0 px-5 py-2.5 text-sm font-medium", value === t.id ? "border-brand bg-gradient-to-b from-brand to-brand-dark text-white" : "border-line bg-panel text-zinc-400 hover:text-white")}>{t.icon}{t.label}</button>
    ))}
  </div>
);
export const Bar = ({ pct, color }: { pct: number; color: string }) => (
  <div className="h-2 flex-1 rounded-full bg-zinc-800"><div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} /></div>
);
export const Toggle = ({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cn("h-6 w-11 rounded-full p-0.5 transition", on ? "bg-brand" : "bg-zinc-700")}>
    <span className={cn("block h-5 w-5 rounded-full bg-white transition", on && "translate-x-5")} />
  </button>
);
export const SevBadge = ({ s }: { s: string }) => (
  <span className={cn("rounded border px-2 py-0.5 text-xs", s === "High" ? "border-brand/60 bg-brand/15 text-brand" : s === "Medium" ? "border-amber-500/60 bg-amber-500/10 text-amber-400" : "border-sky-500/60 bg-sky-500/10 text-sky-400")}>{s}</span>
);
export const PageHeader = ({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) => (
  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div><h1 className="text-2xl font-bold">{title}</h1>{sub && <p className="text-sm text-zinc-400">{sub}</p>}</div>
    <div className="flex items-center gap-2">{right}</div>
  </div>
);
