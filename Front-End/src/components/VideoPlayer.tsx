import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, SkipForward, Volume2, VolumeX, Maximize } from "lucide-react";
import type { Mistake } from "@/api/types";
import { fmt } from "@/lib/utils";
import { categoryColor } from "@/data/mock";

const SPEEDS = [0.5, 1, 1.5, 2];
export interface PlayerHandle { seek: (t: number, play?: boolean) => void }

interface Props {
  src: string; mistakes: Mistake[]; activeId?: string; showBoxes: boolean;
  onTime?: (t: number) => void; onDuration?: (d: number) => void; onReady?: (h: PlayerHandle) => void; onNextMistake?: () => void;
}
export default function VideoPlayer({ src, mistakes, activeId, showBoxes, onTime, onDuration, onReady, onNextMistake }: Props) {
  const v = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0), [dur, setDur] = useState(0), [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1), [muted, setMuted] = useState(false), [err, setErr] = useState(false);

  const seek = useCallback((time: number, play = false) => {
    const el = v.current; if (!el) return;
    el.currentTime = time; setT(time);
    if (play) el.play().catch(() => {}); else el.pause();
  }, []);
  useEffect(() => { onReady?.({ seek }); }, [seek, onReady]);
  useEffect(() => { setErr(false); }, [src]);
  useEffect(() => { if (v.current) v.current.playbackRate = speed; }, [speed]);

  const toggle = () => { const el = v.current; if (!el) return; el.paused ? el.play().catch(() => {}) : el.pause(); };
  const fullscreen = () => { document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen(); };
  const active = mistakes.find((m) => m.id === activeId);
  const live = mistakes.find((m) => t >= m.start && t <= m.end && m.bbox);
  const shown = showBoxes ? (live ?? (active && t >= active.start && t <= active.end ? active : undefined)) : undefined;

  return (
    <div className="card overflow-hidden">
      <div ref={box} className="relative bg-black" tabIndex={0}
        onKeyDown={(e) => { if (e.key === " ") { e.preventDefault(); toggle(); } if (e.key === "ArrowRight") seek(Math.min(dur, t + 5), playing); if (e.key === "ArrowLeft") seek(Math.max(0, t - 5), playing); }}>
        <video ref={v} src={src} className="aspect-video w-full cursor-pointer bg-black" onClick={toggle} playsInline preload="metadata" muted={muted}
          onLoadedMetadata={(e) => { setDur(e.currentTarget.duration); onDuration?.(e.currentTarget.duration); }}
          onTimeUpdate={(e) => { setT(e.currentTarget.currentTime); onTime?.(e.currentTarget.currentTime); }}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setErr(true)} />
        {err && <div className="absolute inset-0 grid place-items-center bg-black/80 text-sm text-zinc-300">Video could not be loaded.</div>}
        {shown?.bbox && (
          <div className="pointer-events-none absolute border-2 border-brand" style={{ left: `${shown.bbox.x * 100}%`, top: `${shown.bbox.y * 100}%`, width: `${shown.bbox.w * 100}%`, height: `${shown.bbox.h * 100}%` }}>
            <span className="absolute -top-6 left-[-2px] bg-brand px-2 py-0.5 text-xs font-semibold">{shown.bbox.label} {shown.bbox.conf.toFixed(2)}</span>
          </div>
        )}
        {shown?.bbox && <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-[10px] uppercase text-zinc-300">Demo overlay · not real detection</span>}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-2 pt-8">
          <input type="range" min={0} max={dur || 1} step={0.1} value={t} aria-label="Seek" className="w-full" onChange={(e) => seek(Number(e.target.value), playing)} />
          <div className="mt-1 flex items-center gap-4 text-sm">
            <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
            <button onClick={onNextMistake} aria-label="Next mistake" title="Next mistake"><SkipForward className="h-5 w-5" /></button>
            <span className="tabular-nums">{fmt(t)} / {fmt(dur)}</span>
            <span className="flex-1" />
            <button onClick={() => setMuted(!muted)} aria-label="Mute">{muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button>
            <button className="w-10 text-center tabular-nums" onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} aria-label="Playback speed">{speed.toFixed(1)}x</button>
            <button onClick={fullscreen} aria-label="Fullscreen"><Maximize className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
      {/* timeline with mistake markers */}
      <div className="border-t border-line px-4 py-3">
        <div className="relative h-9">
          <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-zinc-800">
            <div className="h-2 rounded-full bg-brand/70" style={{ width: `${dur ? (t / dur) * 100 : 0}%` }} />
          </div>
          {dur > 0 && mistakes.map((m) => (
            <button key={m.id} onClick={() => seek(m.start, true)} title={`${fmt(m.start)} · ${m.category}`} aria-label={`Mistake at ${fmt(m.start)}`}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(m.start / dur) * 100}%` }}>
              <span className={`block h-4 w-4 rounded-full border-2 ${m.id === activeId ? "scale-150" : ""}`} style={{ background: categoryColor[m.category], borderColor: m.id === activeId ? "#fff" : "#0b0b10" }} />
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500"><span>0:00</span><span>{fmt(dur)}</span></div>
      </div>
    </div>
  );
}
