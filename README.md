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
| `AWS_SECRET_ACCESS_KEY` | Secret key for the future Bedrock request |
| `BEDROCK_MODEL_ID` | Bedrock model identifier |

`.env.local` is ignored by Git.

## Current mock API behavior

`POST /api/analyze` accepts JSON with `type` and `content`.

- `content` is required and must be a non-empty string.
- Invalid input returns a clear `400` response.
- The route waits about one second to simulate analysis.
- It then returns a prepared bank gift-card scam result from `lib/demo-results.ts`.
- Amazon Bedrock is not called on this branch. A comment in `app/api/analyze/route.ts` marks where that request will go.

Shared contracts:

- `types/analysis.ts` — `ClaraRisk` and `ClaraAnalysis`
- `lib/analysis-schema.ts` — matching Zod schema for future Bedrock output

## Planned Bedrock integration

The next backend step is to send the submitted message to Amazon Bedrock and validate the model response with `claraAnalysisSchema` before returning it. The AWS SDK dependency is already installed so that work can start without changing the project structure.

## Privacy and safety principles

- Clara is a second-opinion tool, not a decision-maker.
- Users should pause before they click a link, reply, or send money.
- Clara should not store messages longer than needed to produce a result.
- Do not place real credentials, personal financial details, or production secrets in the repository.
- When something looks risky, the safest next step is to contact a bank, law enforcement, or a trusted person through a number the user already has.

Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.
