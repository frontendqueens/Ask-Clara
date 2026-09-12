# Ask Clara

Ask Clara is an accessible AI safety companion that helps older adults understand suspicious messages before they click a link, reply, or send money.

Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.

## Technology stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- TypeScript
- Tailwind CSS
- ESLint
- [Zod](https://zod.dev/) for shared analysis validation
- [Lucide React](https://lucide.dev/) for a few simple icons
- AWS SDK client for Bedrock Runtime (installed, not wired yet)

## Local setup

1. Install [Node.js](https://nodejs.org/) 20 or later.
2. Clone this repository and move into the project folder.
3. Create a feature branch. Do not work directly on `main`.
4. Install dependencies:

```bash
npm install
```

5. Copy the environment template. Leave the values empty unless you are connecting to AWS later:

```bash
cp .env.example .env.local
```

Never put real AWS credentials in source code, `.env.example`, this README, or a commit.

## Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Enter or edit a suspicious message, then choose **Check it with Clara**.

Other useful commands:

```bash
npm run lint
npm run build
npm start
```

## Environment variables

These placeholders live in `.env.example`. They are not used by the current mock API.

| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | AWS region for the future Bedrock request |
| `AWS_ACCESS_KEY_ID` | Access key for the future Bedrock request |
| `AWS_SECRET_ACCESS_KEY` | Secret key for the Bedrock request |
| `BEDROCK_MODEL_ID` | Bedrock model or inference profile ID |

`.env.local` is ignored by Git. Restart the development server after changing it.

## Current API behavior

`POST /api/analyze` accepts JSON with `type` and `content`.

- `content` is required and must be a non-empty string.
- Invalid input returns a clear `400` response.
- If AWS environment variables are set, a Strands agent calls Amazon Bedrock and validates the result with `claraAnalysisSchema`.
- If those variables are missing, the route waits about one second and returns the prepared gift-card demo from `lib/demo-results.ts`.
- A Bedrock failure returns `502` and does not silently swap in the demo result.

Shared contracts:

- `types/analysis.ts` — `ClaraRisk` and `ClaraAnalysis`
- `lib/analysis-schema.ts` — matching Zod schema for Bedrock structured output
- `lib/clara-agent.ts` — Strands + Bedrock agent

## Planned Bedrock work

Screenshot analysis still sends a filename description, not image bytes. Multimodal input can be added later. AgentCore hosting is optional and not required for local demo.

## Privacy and safety principles

- Clara is a second-opinion tool, not a decision-maker.
- Users should pause before they click a link, reply, or send money.
- Clara should not store messages longer than needed to produce a result.
- Do not place real credentials, personal financial details, or production secrets in the repository.
- When something looks risky, the safest next step is to contact a bank, law enforcement, or a trusted person through a number the user already has.

Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.
