import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, PlayCircle, History, BarChart3, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { USE_MOCK } from "@/api/client";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze Video", icon: PlayCircle },
  { to: "/history", label: "History", icon: History },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];
const Logo = () => (
  <div className="flex items-center gap-3 px-5 py-6">
    <img
      src="/Glowing Coral Angular V Emblem.png"
      alt="Vanlyzer"
      className="h-10 w-10 object-contain"
    />
    <div><div className="text-xl font-bold leading-tight">Vanlyzer</div><div className="text-xs text-zinc-400">AI Valorant Coach</div></div>
  </div>
);
export default function Layout() {
  const [open, setOpen] = useState(false);
  const side = (
    <aside className="flex h-full w-[218px] flex-col border-r border-line bg-[#0e0e14]">
      <Logo />
      <nav className="space-y-1 px-3">
        {nav.map(({ to, label, icon: I }) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
            className={({ isActive }) => cn("flex items-center gap-3 rounded-lg border px-4 py-3 text-[15px] font-medium", isActive ? "border-brand/70 bg-gradient-to-r from-brand/40 to-brand/10 text-white" : "border-transparent text-zinc-400 hover:text-white")}>
            <I className="h-5 w-5" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <img src="/agent.png" alt="" className="w-full select-none opacity-90" draggable={false} />
        <div className="m-3 rounded-lg border border-line bg-panel p-3 text-sm"><div className="font-semibold">V-Insight v1.0</div><div className="text-xs text-zinc-400">{USE_MOCK ? "Demo mode · sample data" : "Connected to API"}</div></div>
      </div>
    </aside>
  );
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">{side}</div>
      {open && <div className="fixed inset-0 z-40 flex lg:hidden"><div>{side}</div><div className="flex-1 bg-black/60" onClick={() => setOpen(false)} /></div>}
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button><span className="font-bold">V-Insight</span>
        </div>
        <div className="mx-auto max-w-[1400px] p-5 lg:p-6"><Outlet /></div>
      </main>
    </div>
  );
}
