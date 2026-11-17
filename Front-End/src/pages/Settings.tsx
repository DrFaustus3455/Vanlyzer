import { useEffect, useState } from "react";
import { api } from "@/api/client";
import { useAsync } from "@/lib/hooks";
import type { Settings } from "@/api/types";
import { PageHeader, Spinner, ErrorBox, Toggle, DemoBadge } from "@/components/ui";

export default function SettingsPage() {
  const { data, loading, error, reload } = useAsync(() => api.getSettings());
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (data) setS(data); }, [data]);
  useEffect(() => { if (s) document.documentElement.style.filter = s.theme === "light" ? "invert(1) hue-rotate(180deg)" : ""; }, [s?.theme]);
  if (loading) return <Spinner />; if (error || !s) return <ErrorBox message={error ?? "Failed"} onRetry={reload} />;
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => { setS({ ...s, [k]: v }); setSaved(false); };
  const Row = ({ l, d, children }: { l: string; d?: string; children: React.ReactNode }) => <div className="flex items-center justify-between gap-4 border-t border-line py-3 first:border-0"><div><div className="text-sm font-medium">{l}</div>{d && <div className="text-xs text-zinc-500">{d}</div>}</div>{children}</div>;
  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Settings" right={<DemoBadge />} />
      <div className="card p-5"><h3 className="mb-2 font-bold">Appearance</h3><Row l="Theme" d="Light mode is an experimental inverted palette."><select className="rounded-lg border border-line bg-panel2 px-3 py-2 text-sm" value={s.theme} onChange={(e) => set("theme", e.target.value as Settings["theme"])}><option value="dark">Dark</option><option value="light">Light (experimental)</option></select></Row></div>
      <div className="card p-5"><h3 className="mb-2 font-bold">Privacy</h3><Row l="Share anonymous usage stats" d="Off by default."><Toggle label="Share stats" on={s.shareAnonymousStats} onChange={(v) => set("shareAnonymousStats", v)} /></Row></div>
      <div className="card p-5"><h3 className="mb-2 font-bold">Storage</h3>
        <Row l="Keep uploaded videos after analysis"><Toggle label="Keep videos" on={s.keepVideos} onChange={(v) => set("keepVideos", v)} /></Row>
        <Row l="Auto-delete videos after (days)"><input type="number" min={1} max={365} value={s.autoDeleteDays} onChange={(e) => set("autoDeleteDays", Math.min(365, Math.max(1, Number(e.target.value) || 1)))} className="w-24 rounded-lg border border-line bg-panel2 px-3 py-2 text-sm" /></Row></div>
      <div className="card p-5"><h3 className="mb-2 font-bold">Analysis</h3>
        <Row l="Default detail level"><select className="rounded-lg border border-line bg-panel2 px-3 py-2 text-sm" value={s.defaultDetail} onChange={(e) => set("defaultDetail", e.target.value as Settings["defaultDetail"])}><option value="quick">Quick</option><option value="standard">Standard</option><option value="indepth">In-Depth</option></select></Row>
        <Row l="Show bounding boxes by default"><Toggle label="Boxes" on={s.showBoundingBoxes} onChange={(v) => set("showBoundingBoxes", v)} /></Row></div>
      <div className="flex items-center gap-3"><button className="btn btn-primary" onClick={async () => { await api.saveSettings(s); setSaved(true); }}>Save settings</button>{saved && <span className="text-sm text-green-400">Saved</span>}</div>
    </div>
  );
}
