import axios from "axios";
import type { AnalysisJob, AnalysisOptions, Match, MatchReport, Mistake, Settings, Drill } from "./types";
import { mockMatches, mockMistakes, mockDrills, mockSettings } from "@/data/mock";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";
const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api", timeout: 30000 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface Api {
  listMatches(): Promise<Match[]>;
  getReport(matchId: string): Promise<MatchReport>;
  listMistakes(matchId?: string): Promise<Mistake[]>;
  uploadVideo(file: File, onProgress: (pct: number) => void, signal?: AbortSignal): Promise<Match>;
  startAnalysis(matchId: string, opts: AnalysisOptions): Promise<AnalysisJob>;
  getJob(jobId: string): Promise<AnalysisJob>;
  listDrills(): Promise<Drill[]>;
  getSettings(): Promise<Settings>;
  saveSettings(s: Settings): Promise<Settings>;
}

/* ---- Real FastAPI implementation (endpoints are the contract for the backend) ---- */
const real: Api = {
  listMatches: async () => (await http.get<Match[]>("/matches")).data,
  getReport: async (id) => (await http.get<MatchReport>(`/matches/${id}/report`)).data,
  listMistakes: async (id) => (await http.get<Mistake[]>("/mistakes", { params: { match_id: id } })).data,
  uploadVideo: async (file, onProgress, signal) => {
    const fd = new FormData(); fd.append("file", file);
    return (await http.post<Match>("/videos", fd, { signal, timeout: 0, onUploadProgress: (e) => e.total && onProgress(Math.round((e.loaded / e.total) * 100)) })).data;
  },
  startAnalysis: async (matchId, opts) => (await http.post<AnalysisJob>("/analysis", { match_id: matchId, ...opts })).data,
  getJob: async (id) => (await http.get<AnalysisJob>(`/analysis/${id}`)).data,
  listDrills: async () => (await http.get<Drill[]>("/training/drills")).data,
  getSettings: async () => (await http.get<Settings>("/settings")).data,
  saveSettings: async (s) => (await http.put<Settings>("/settings", s)).data,
};

/* ---- Mock implementation: demo data only. It does NOT analyze video. ---- */
let settings = (() => { try { return { ...mockSettings, ...JSON.parse(localStorage.getItem("vi-settings") ?? "{}") }; } catch { return mockSettings; } })();
const mock: Api = {
  listMatches: async () => { await sleep(250); return mockMatches; },
  getReport: async (id) => {
    await sleep(250);
    const match = mockMatches.find((m) => m.id === id) ?? mockMatches[0];
    return { match, mistakes: mockMistakes, takeaway: "Keep your crosshair at head level, avoid wide peeks, and be more mindful of multi-enemy angles.",
      strengths: ["Strong first-contact reaction time", "Good trading with teammates", "Consistent spray control at mid range"],
      weaknesses: ["Crosshair drops below head level while moving", "Over-exposure after taking a duel", "Utility often thrown after contact"] };
  },
  listMistakes: async () => { await sleep(150); return mockMistakes; },
  uploadVideo: async (file, onProgress, signal) => {
    for (let p = 0; p <= 100; p += 10) { if (signal?.aborted) throw new DOMException("Cancelled", "AbortError"); onProgress(p); await sleep(120); }
    return { id: `local-${Date.now()}`, filename: file.name, map: "Unknown", mode: "—", result: "Victory", duration: 0, resolution: "—", fps: 0, score: 0, mistakeCount: 0, reviewedAt: "just now", videoUrl: URL.createObjectURL(file), status: "uploaded" };
  },
  startAnalysis: async (matchId) => ({ id: `job-${matchId}`, matchId, status: "queued", progress: 0, stage: "Queued (demo)" }),
  getJob: async (id) => {
    await sleep(200);
    const t = Number(sessionStorage.getItem(id) ?? 0) + 8; sessionStorage.setItem(id, String(Math.min(t, 100)));
    const stage = t < 30 ? "Extracting frames (demo)" : t < 70 ? "Simulated detection (demo)" : "Compiling demo report";
    return { id, matchId: id.replace("job-", ""), status: t >= 100 ? "complete" : "processing", progress: Math.min(t, 100), stage };
  },
  listDrills: async () => mockDrills,
  getSettings: async () => settings,
  saveSettings: async (s) => { settings = s; localStorage.setItem("vi-settings", JSON.stringify(s)); return s; },
};

export const api: Api = USE_MOCK ? mock : real;
