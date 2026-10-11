# Placement Season Simulator

A browser game that turns campus placement season into a decision game, plus three real tools built on the same engine: a **mock interview agent**, a **resume analyzer** and a **job-description-to-drive** converter.

You pick a company drive, choose a career track, build a skill stack, plan prep activities, lay out your resume, take mentor advice, choose an application strategy and face a recruiter panel. Hidden scoring (Skills, Projects, Resume, Communication) produces a grade, recruiter feedback and a personal 4-week prep roadmap.



## Run it

```bash
npm install          # use install, not "npm ci"
npm run dev          # http://localhost:3000
npm test             # 26 unit tests
npm run build
```

Optional AI keys (everything works without them). Copy `.env.example` to `.env.local`.

## What is new

| Feature | Where | Needs a key? |
|---|---|---|
| 18 company drives (fictional companies, 7 types) | `data/problems.ts` | no |
| 78 skills, 6 career tracks with slot boards | `data/techRegistry.ts`, `data/architectureTemplates.ts` | no |
| Resume builder and evaluator | `lib/pitchDeckEvaluator.ts` | no |
| Season rules (21), events (10), squad advice, mentor advice | `lib/seasonRules.ts`, `data/*`, `lib/projectStrategyGenerator.ts`, `store/gameStore.ts` | no |
| **Mock interview agent** (plan, retrieve, grade, feedback) | `app/interview`, `app/api/interview`, `lib/interviewAgent.ts` | optional (feedback wording) |
| **RAG knowledge base + retriever** (BM25, optional embedding rerank) | `data/kb/*`, `lib/rag/retriever.ts` | optional (rerank) |
| **Resume analyzer** | `app/resume`, `app/api/resume-analyze`, `lib/resumeAnalyzer.ts` | optional (bullet rewrites) |
| **Paste a real job description as your drive** | `lib/jdParser.ts`, `app/api/drive-from-jd` | no |
| **Personal prep roadmap** (retrieval-grounded) | `lib/roadmapGenerator.ts`, `app/api/generate-roadmap` | optional (coach note) |
| One scoring engine with tests | `lib/scoring.ts`, `tests/` | no |

## How the AI parts work

- **Scores are never decided by an LLM.** The interview agent grades with a fixed rubric (`data/kb/questions.ts`: key points per question). An LLM, if configured, only rewrites feedback text.
- **Retrieval (RAG)**: a curated knowledge base of general placement guidance (`data/kb/knowledge.ts`, 51 chunks) is searched with BM25. With `OPENAI_API_KEY`, the top candidates can be reranked by embeddings (`searchHybrid`). Swap the index for pgvector when the knowledge base grows. Add your own chunks with `addChunks()`.
- **Agent loop**: plan the next question (weakest topic, rising difficulty) -> retrieve study notes -> grade -> feedback -> repeat for 5 questions -> summary.
- **Safety**: user text and retrieved text are wrapped in `<untrusted>` tags and the model is told never to follow instructions inside them. Inputs are size-limited, schema-validated (zod) and rate-limited. Every AI path has an offline fallback.

## Knowledge base honesty

The built-in knowledge base is **general guidance written for this project**. It is not scraped from any company and does not describe a specific employer's current process. Companies in the game are fictional. Always verify real eligibility, dates and rounds on the official careers page.

## Project map

```
app/            pages (/, /game, /results, /interview, /resume) and API routes
components/     game UI
data/           drives, skills, tracks, recruiters, events, season rules, kb/
lib/            scoring, seasonRules, vocabulary, roles, rag/, llm, agents, generators
store/          Zustand game store
tests/          vitest unit tests
```

Internal ids inherited from the original game are stable on purpose (`innovation`, `execution`, `design`, `pitch`, `judge-builder`, stage ids, track ids such as `web-app`). `lib/vocabulary.ts` maps them to what the player sees (Skills, Projects, Resume, Communication, Product SWE, and so on).

## Known limits

- The in-memory rate limiter is per server instance. Use Redis (for example Upstash) before real traffic.
- `app/game/page.tsx` is still a very large file. Splitting it by stage is the next refactor.
- LLM and embedding code paths were written against the providers' documented APIs and covered by mocked tests, but were not run against live keys.
- Squad chat text and some legacy store messages are partly generic. Playtest and tune the wording.
