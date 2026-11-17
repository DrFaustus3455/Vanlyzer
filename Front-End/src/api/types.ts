export type Severity = "High" | "Medium" | "Low";
export type Category = "Crosshair Placement" | "Poor Positioning" | "Unfavorable Engagement" | "Utility Usage" | "Decision Timing";
export interface BBox { x: number; y: number; w: number; h: number; label: string; conf: number } // normalized 0..1
export interface Mistake {
  id: string; category: Category; severity: Severity; start: number; end: number;
  title: string; explanation: string; tips: string[]; bbox?: BBox;
}
export interface Match {
  id: string; filename: string; map: string; mode: string; result: "Victory" | "Defeat";
  duration: number; resolution: string; fps: number; score: number; mistakeCount: number;
  reviewedAt: string; videoUrl: string; status: "complete" | "processing" | "queued" | "uploaded"; progress?: number;
}
export interface MatchReport {
  match: Match; mistakes: Mistake[]; strengths: string[]; weaknesses: string[]; takeaway: string;
}
export interface AnalysisJob { id: string; matchId: string; status: "queued" | "processing" | "complete" | "failed"; progress: number; stage: string; error?: string }
export interface AnalysisOptions { focus: "overall" | "aim" | "utility" | "positioning"; detail: "quick" | "standard" | "indepth"; detectMistakes: boolean; trainingPlan: boolean }
export interface Drill { id: string; title: string; category: Category; minutes: number; description: string; day: number }
export interface Settings { theme: "dark" | "light"; shareAnonymousStats: boolean; keepVideos: boolean; autoDeleteDays: number; defaultDetail: AnalysisOptions["detail"]; showBoundingBoxes: boolean }
