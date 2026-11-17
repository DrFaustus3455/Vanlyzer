import { useEffect, useRef, useState } from "react";
import { fmt } from "@/lib/utils";

/** Grabs a real frame from the video at time t using a hidden <video> + canvas. */
export default function EvidenceFrame({ src, t, box }: { src: string; t: number; box?: { x: number; y: number; w: number; h: number } }) {
  const c = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const v = document.createElement("video");
    v.src = src; v.muted = true; v.preload = "auto"; v.crossOrigin = "anonymous";
    v.onloadedmetadata = () => { v.currentTime = Math.min(t + 0.5, v.duration || t); };
    v.onseeked = () => {
      const cv = c.current; if (!cv) return;
      cv.width = 320; cv.height = 180;
      cv.getContext("2d")?.drawImage(v, 0, 0, 320, 180);
      if (box) { const g = cv.getContext("2d")!; g.strokeStyle = "#ff4655"; g.lineWidth = 2; g.strokeRect(box.x * 320, box.y * 180, box.w * 320, box.h * 180); }
    };
    v.onerror = () => setFailed(true);
    return () => { v.removeAttribute("src"); v.load(); };
  }, [src, t, box]);
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-zinc-900">
      {failed ? <div className="grid aspect-video place-items-center text-xs text-zinc-500">Frame unavailable</div> : <canvas ref={c} className="aspect-video w-full" />}
      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 text-xs">{fmt(t)}</span>
    </div>
  );
}
