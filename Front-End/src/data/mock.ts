import type { Match, Mistake, Drill, Settings } from "@/api/types";

export const DEMO_VIDEO = "/demo.mp4"; // synthetic test pattern, NOT real gameplay

export const mockMistakes: Mistake[] = [
  { id: "m1", category: "Crosshair Placement", severity: "High", start: 8, end: 12, title: "Crosshair below head level",
    explanation: "Your crosshair was aimed at chest level when the enemy appeared, which made the shot harder and slower.",
    tips: ["Keep your crosshair at head level (pre-aim).", "Anticipate common enemy positions.", "Practice head-level crosshair drills."],
    bbox: { x: 0.42, y: 0.38, w: 0.1, h: 0.3, label: "Enemy", conf: 0.92 } },
  { id: "m2", category: "Poor Positioning", severity: "Medium", start: 22, end: 27, title: "Standing in open space",
    explanation: "You held an angle with no cover behind you, so a second enemy could trade you freely.",
    tips: ["Hold angles next to cover.", "Avoid standing in the middle of long sightlines.", "Fall back after taking first contact."],
    bbox: { x: 0.25, y: 0.45, w: 0.12, h: 0.32, label: "Enemy", conf: 0.81 } },
  { id: "m3", category: "Crosshair Placement", severity: "High", start: 36, end: 40, title: "Crosshair drifting while rotating",
    explanation: "While rotating your crosshair dropped toward the floor and had to be raised when contact happened.",
    tips: ["Keep aim at head height while moving.", "Aim at corners before you reach them.", "Use shorter, controlled movements."],
    bbox: { x: 0.58, y: 0.3, w: 0.1, h: 0.34, label: "Enemy", conf: 0.88 } },
  { id: "m4", category: "Unfavorable Engagement", severity: "High", start: 51, end: 56, title: "Wide peek into multiple angles",
    explanation: "You wide-peeked an angle covered by two enemies and gave up your off-angle advantage.",
    tips: ["Shoulder-peek to gather information.", "Take duels one at a time.", "Wait for teammate trade support."],
    bbox: { x: 0.5, y: 0.35, w: 0.1, h: 0.3, label: "Enemy", conf: 0.9 } },
  { id: "m5", category: "Utility Usage", severity: "Low", start: 66, end: 70, title: "Utility used too late",
    explanation: "Your utility was thrown after the enemy was already in view, which wasted its value.",
    tips: ["Use utility before you swing.", "Pair utility with your entry timing.", "Save utility for contested spaces."] },
  { id: "m6", category: "Decision Timing", severity: "Medium", start: 80, end: 85, title: "Hesitated on a clear window",
    explanation: "You waited several seconds after the enemy ability expired and lost your tempo advantage.",
    tips: ["Commit once the window opens.", "Call a timing with the team.", "Reset if the window is gone."] },
  { id: "m7", category: "Crosshair Placement", severity: "Medium", start: 95, end: 99, title: "Not pre-aiming a common angle",
    explanation: "A frequently held position was left uncleared with your crosshair pointing at the wall.",
    tips: ["Clear common spots in order.", "Pre-aim the first corner you reach."],
    bbox: { x: 0.34, y: 0.33, w: 0.1, h: 0.3, label: "Enemy", conf: 0.77 } },
  { id: "m8", category: "Poor Positioning", severity: "Low", start: 108, end: 113, title: "Overexposed after the kill",
    explanation: "You stayed in the same spot after your kill instead of repositioning.",
    tips: ["Move after taking a duel.", "Swap to a new angle before the retake."] },
];

const base = { mode: "Ranked", resolution: "1080p", fps: 60 };
export const mockMatches: Match[] = [
  { id: "demo-1", filename: "Ascent_Ranked.mp4", map: "Ascent", ...base, result: "Victory", duration: 120, score: 72, mistakeCount: 8, reviewedAt: "18 hours ago", videoUrl: DEMO_VIDEO, status: "complete" },
  { id: "demo-2", filename: "Haven_Ranked.mp4", map: "Haven", ...base, result: "Defeat", duration: 1457, score: 64, mistakeCount: 19, reviewedAt: "2 days ago", videoUrl: DEMO_VIDEO, status: "complete" },
  { id: "demo-3", filename: "Bind_Ranked.mp4", map: "Bind", ...base, result: "Victory", duration: 1265, score: 78, mistakeCount: 10, reviewedAt: "3 days ago", videoUrl: DEMO_VIDEO, status: "complete" },
  { id: "demo-4", filename: "Lotus_Ranked.mp4", map: "Lotus", ...base, result: "Victory", duration: 1173, score: 76, mistakeCount: 14, reviewedAt: "4 days ago", videoUrl: DEMO_VIDEO, status: "complete" },
  { id: "demo-5", filename: "Split_Ranked.mp4", map: "Split", ...base, result: "Defeat", duration: 1326, score: 61, mistakeCount: 22, reviewedAt: "5 days ago", videoUrl: DEMO_VIDEO, status: "complete" },
];

export const mockDrills: Drill[] = [
  { id: "d1", title: "Crosshair Control Drills", category: "Crosshair Placement", minutes: 10, day: 1, description: "Train consistent head-level crosshair placement." },
  { id: "d2", title: "Angle Holding & Positioning", category: "Poor Positioning", minutes: 12, day: 2, description: "Learn safer, higher-value positions and avoid overexposure." },
  { id: "d3", title: "Utility Timing Practice", category: "Utility Usage", minutes: 8, day: 3, description: "Improve the timing and impact of your utility usage." },
  { id: "d4", title: "Shoulder-Peek Practice", category: "Unfavorable Engagement", minutes: 10, day: 4, description: "Gather info without committing to a wide peek." },
  { id: "d5", title: "Tempo & Commit Drill", category: "Decision Timing", minutes: 8, day: 5, description: "Practice committing to timing windows." },
  { id: "d6", title: "Deathmatch Head-Level Focus", category: "Crosshair Placement", minutes: 15, day: 6, description: "Play a deathmatch focusing only on crosshair height." },
];

export const mockSettings: Settings = { theme: "dark", shareAnonymousStats: false, keepVideos: true, autoDeleteDays: 30, defaultDetail: "standard", showBoundingBoxes: true };

export const categoryShare = [
  { name: "Crosshair Placement", value: 35, color: "#ff4655" },
  { name: "Poor Positioning", value: 22, color: "#a855f7" },
  { name: "Unfavorable Engagement", value: 18, color: "#3b82f6" },
  { name: "Utility Usage", value: 15, color: "#22c55e" },
  { name: "Decision Timing", value: 10, color: "#2dd4bf" },
];
export const categoryColor: Record<string, string> = Object.fromEntries(categoryShare.map((c) => [c.name, c.color]));
export const progressSeries = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"].map((w, i) => ({
  week: w, score: [58, 61, 60, 64, 67, 69, 70, 72][i], crosshair: [14, 13, 13, 11, 10, 9, 8, 7][i], positioning: [9, 9, 8, 8, 7, 6, 6, 5][i], engagement: [7, 7, 6, 6, 5, 5, 4, 4][i], utility: [5, 5, 5, 4, 4, 3, 3, 3][i],
}));
