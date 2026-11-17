import { CheckCircle2, AlertCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { MatchReport } from "@/api/types";
import { categoryShare, categoryColor } from "@/data/mock";

export default function SummaryTab({ report }: { report: MatchReport }) {
  const data = categoryShare.map((c) => ({ name: c.name, n: report.mistakes.filter((m) => m.category === c.name).length })).filter((d) => d.n);
  const List = ({ items, good }: { items: string[]; good?: boolean }) => (
    <ul className="space-y-3 text-sm">{items.map((s) => <li key={s} className="flex gap-2">{good ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" /> : <AlertCircle className="h-5 w-5 shrink-0 text-brand" />}{s}</li>)}</ul>
  );
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-5"><h3 className="mb-3 font-bold">Strengths</h3><List items={report.strengths} good /></div>
      <div className="card p-5"><h3 className="mb-3 font-bold">Weaknesses</h3><List items={report.weaknesses} /></div>
      <div className="card p-5 lg:col-span-2">
        <h3 className="mb-3 font-bold">Mistake Breakdown</h3>
        <div className="h-60"><ResponsiveContainer><BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <XAxis type="number" allowDecimals={false} stroke="#71717a" /><YAxis type="category" dataKey="name" width={170} stroke="#a1a1aa" />
          <Tooltip contentStyle={{ background: "#13131a", border: "1px solid #26262f" }} cursor={{ fill: "#ffffff10" }} />
          <Bar dataKey="n" radius={4}>{data.map((d) => <Cell key={d.name} fill={categoryColor[d.name]} />)}</Bar></BarChart></ResponsiveContainer></div>
        <p className="mt-3 text-sm text-zinc-400">{report.takeaway}</p>
      </div>
    </div>
  );
}
