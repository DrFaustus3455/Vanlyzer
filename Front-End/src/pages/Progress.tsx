import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { progressSeries } from "@/data/mock";
import { PageHeader, DemoBadge } from "@/components/ui";
import { cn } from "@/lib/utils";

const tip = { contentStyle: { background: "#13131a", border: "1px solid #26262f" } };
export default function Progress() {
  const [range, setRange] = useState(8);
  const data = progressSeries.slice(-range);
  return (
    <div>
      <PageHeader title="Progress" sub="Improvement over time and recurring mistake trends." right={<DemoBadge />} />
      <div className="mb-4 flex gap-2">{[4, 8].map((r) => <button key={r} className={cn("chip", range === r && "chip-on")} onClick={() => setRange(r)}>Last {r} weeks</button>)}</div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5"><h3 className="mb-3 font-bold">Focus Score</h3><div className="h-64"><ResponsiveContainer><LineChart data={data}><CartesianGrid stroke="#26262f" /><XAxis dataKey="week" stroke="#71717a" /><YAxis domain={[50, 80]} stroke="#71717a" /><Tooltip {...tip} /><Line dataKey="score" stroke="#ff4655" strokeWidth={3} dot /></LineChart></ResponsiveContainer></div></div>
        <div className="card p-5"><h3 className="mb-3 font-bold">Recurring Mistakes per Week</h3><div className="h-64"><ResponsiveContainer><LineChart data={data}><CartesianGrid stroke="#26262f" /><XAxis dataKey="week" stroke="#71717a" /><YAxis stroke="#71717a" /><Tooltip {...tip} /><Legend />
          <Line dataKey="crosshair" name="Crosshair" stroke="#ff4655" /><Line dataKey="positioning" name="Positioning" stroke="#a855f7" /><Line dataKey="engagement" name="Engagement" stroke="#3b82f6" /><Line dataKey="utility" name="Utility" stroke="#22c55e" /></LineChart></ResponsiveContainer></div></div>
      </div>
      <p className="mt-3 text-xs text-zinc-500">Sample data. Real trends will be computed from your analyzed matches once the backend is connected.</p>
    </div>
  );
}
