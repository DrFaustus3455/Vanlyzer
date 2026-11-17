# V-Insight — AI Valorant Coach (frontend)

React + TypeScript + Vite + Tailwind. Runs standalone on demo data.

## Setup
```bash
npm install
cp .env.example .env     # VITE_USE_MOCK_API=true by default
npm run dev              # http://localhost:5173
npm run build
```

## Demo mode (important)
With `VITE_USE_MOCK_API=true` everything is **sample data**. Nothing is analyzed.
- `public/demo.mp4` is a synthetic test pattern, not gameplay.
- Mistakes, bounding boxes, scores and advice are hand-written mock data (labelled "Demo data" / "Demo overlay").
- The upload progress and the analysis queue are simulated and say so on screen.

## FastAPI contract (`VITE_USE_MOCK_API=false`, `VITE_API_BASE_URL`)
Typed client: `src/api/client.ts`, types: `src/api/types.ts`.
| Method | Path | Purpose |
|---|---|---|
| GET | /matches | list matches |
| GET | /matches/{id}/report | report + mistakes |
| GET | /mistakes?match_id= | mistake detections (bbox is normalized 0..1) |
| POST | /videos (multipart `file`) | upload |
| POST | /analysis | start job `{match_id, focus, detail, ...}` |
| GET | /analysis/{job_id} | job status/progress |
| GET | /training/drills | drills |
| GET/PUT | /settings | settings |
Backend must serve `match.videoUrl` with CORS and HTTP range support for seeking.

## Notes
- shadcn/ui: not installed via its CLI; buttons/tabs/toggles are small shadcn-style primitives in `src/components/ui.tsx`.
- Routes: `/`, `/analyze`, `/match/:id/{analysis|summary|mistakes|training}`, `/history`, `/progress`, `/settings`.
