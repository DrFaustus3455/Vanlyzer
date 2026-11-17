import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import { Spinner, ErrorBox, Bar } from "@/components/ui";
import { categoryColor } from "@/data/mock";

const KEY = "vi-drills-done";
export default function TrainingTab() {
  const { data, loading, error, reload } = useAsync(() => api.listDrills());
  const [done, setDone] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; } });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(done)); }, [done]);
  if (loading) return <Spinner />;
  if (error || !data) return <ErrorBox message={error ?? "Failed"} onRetry={reload} />;
  const pct = Math.round((done.length / data.length) * 100);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  return (
    <div className="space-y-5">
      <div className="card p-5"><div className="mb-2 flex justify-between text-sm"><b>Weekly completion</b><span>{done.length}/{data.length} drills · {pct}%</span></div><Bar pct={pct} color="#ff4655" /></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((d) => (
          <div key={d.id} className="card p-4">
            <div className="text-xs uppercase text-zinc-500">Day {d.day} · {d.minutes} min</div>
            <div className="mt-1 flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor[d.category] }} />{d.title}</div>
            <p className="my-2 text-sm text-zinc-400">{d.description}</p>
            <button className={`btn w-full ${done.includes(d.id) ? "border-green-600 text-green-400" : ""}`} onClick={() => toggle(d.id)}>
              {done.includes(d.id) ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}{done.includes(d.id) ? "Completed" : "Mark complete"}
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">Demo drills. Completion is saved locally in your browser.</p>
    </div>
  );
}
