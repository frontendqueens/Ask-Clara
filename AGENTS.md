<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Ask Clara

Ask Clara is an accessible AI safety companion for older adults. A person pastes a suspicious message. Clara returns a second opinion before they click a link, reply, or send money.

Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.

Read `README.md` for setup, Bedrock, and demo notes.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS, ESLint
- Import alias `@/*`
- No `src` directory
- Zod, lucide-react, `@strands-agents/sdk`, `@aws-sdk/client-bedrock-runtime`

## Layout

- `app/page.tsx` and `components/clara/` — check flow UI
- `app/api/analyze/route.ts` — `POST /api/analyze`
- `lib/clara-agent.ts` — Strands agent + Bedrock
- `lib/analysis-schema.ts` — Zod contracts
- `lib/demo-results.ts` — mock result and disclaimer
- `types/analysis.ts` — `ClaraRisk` and `ClaraAnalysis`

Keep this shape. Do not add `src/`, auth, a database, or extra UI libraries unless the user asks.

## Analysis contract

`ClaraAnalysis` must stay stable. The UI validates API responses with the same Zod schema.

- `risk`: `low_concern` | `caution` | `likely_scam` | `unclear`
- `headline`, `summary`, `safestNextStep` required
- `warningSigns`: 1–3 items
- `trustedPersonSummary`, `disclaimer` required

Always apply `CLARA_DISCLAIMER` from `lib/demo-results.ts` on the way out.

## Bedrock and Strands

- Call Bedrock through Strands (`Agent` + `BedrockModel`), not a hand-rolled `InvokeModel` unless asked.
- Create a new agent per request. Do not reuse conversation state across users.
- Require `AWS_REGION`, `BEDROCK_MODEL_ID`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY`.
- If any are missing, return the mock in `lib/demo-results.ts`.
- If Bedrock fails, return `502`. Do not silently swap in the gift-card mock.
- Newer Claude models need an inference profile ID (`us.anthropic.…` or `eu.anthropic.…`), not the bare foundation model ID.
- Mark `app/api/analyze/route.ts` as `runtime = "nodejs"`. Keep `@strands-agents/sdk` in `serverExternalPackages`.

## Safety

- Never tell the user to click a link, reply to the sender, call a number from the message, or send money.
- Prefer a number they already have, or asking a trusted person.
- Do not communicate risk through color alone.
- Keep markup semantic and keyboard accessible (`aria-live` for loading, results, and errors).
- Do not add tools that fetch or open the user’s suspicious URL.

## Secrets

- Never read `.env.local` into chat, commit it, or write real keys into `.env.example` or the README.
- Do not log access keys or secrets.

## Git

- Do not commit `.env.local`, `node_modules`, or `.next`.
- Do not work directly on `main` unless the user asks.
- Do not push or force-push unless the user asks.

## Screenshots

`ScreenshotInput` currently sends `Screenshot uploaded: filename`. Do not treat that as real image analysis unless you add multimodal Bedrock input.
