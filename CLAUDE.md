@AGENTS.md

# Claude notes for Ask Clara

You are working on Ask Clara, a hackathon app that helps older adults check suspicious messages. Follow `AGENTS.md` and `README.md`.

## Before changing Next.js code

This is Next.js 16. Read the matching guide under `node_modules/next/dist/docs/` if you are unsure about App Router APIs, route handlers, or config.

## What to do by default

- Keep the existing `ClaraAnalysis` type and `/api/analyze` contract.
- Edit Clara copy and safety rules in `lib/clara-agent.ts`.
- Edit the mock and disclaimer in `lib/demo-results.ts`.
- Edit UI in `components/clara/` without adding component libraries.
- If AWS env vars are missing, the mock path must still work.

## What not to do

- Do not commit or print `.env.local`.
- Do not call Bedrock with a bare model ID when the model requires an inference profile.
- Do not fall back to the gift-card demo after a Bedrock error.
- Do not add AgentCore, auth, or a database unless the user asks.
- Screenshot analysis must send image bytes, not only a filename.

## Quick checks

```bash
npm run lint
npm run build
```

After `.env.local` changes, restart `npm run dev`. Test one scam-like message and one ordinary family message so you can tell Bedrock from the mock.
