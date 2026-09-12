# Ask Clara

A calm, accessible AI safety companion for older adults.

Ask Clara helps people understand suspicious messages before they click a link, reply, share personal information, or send money.

Instead of using technical language or creating fear, Clara provides a clear second opinion:

A simple risk level
Up to three warning signs
One safest next step
A short summary to share with someone they trust 

<img width="1533" height="1305" alt="Screenshot 2026-09-12 at 11 16 58 AM" src="https://github.com/user-attachments/assets/ae4dabfd-50cf-425f-ad01-68d831174fd9" />
<img width="2250" height="1422" alt="Screenshot 2026-09-12 at 17 57 39 (1)" src="https://github.com/user-attachments/assets/9811530f-2ebb-4605-a246-f2312d9b6643" />
<img width="2212" height="1638" alt="Screenshot 2026-09-12 at 17 52 13" src="https://github.com/user-attachments/assets/3ba2306e-1fab-4dd2-b44d-b8a1f0ad5427" />
<img width="2168" height="1632" alt="Screenshot 2026-09-12 at 17 52 36" src="https://github.com/user-attachments/assets/aa91f305-f089-40a2-b52b-30d8eb77d53c" />


## Current status

- Next.js app with the Clara check flow and midnight/paper UI
- Shared `ClaraAnalysis` type and Zod schema
- Temporary mock result when AWS is not configured
- Live analysis through [Strands Agents](https://strandsagents.com/docs/user-guide/quickstart/typescript/) and Amazon Bedrock when `.env.local` is set
- Screenshot upload still sends a filename description, not image bytes

## Technology stack

- [Next.js](https://nextjs.org/) 16 (App Router, TypeScript, Tailwind CSS, ESLint)
- [Zod](https://zod.dev/) for request and analysis validation
- [Lucide React](https://lucide.dev/) for icons
- [@strands-agents/sdk](https://www.npmjs.com/package/@strands-agents/sdk) for the Clara agent
- Amazon Bedrock as the model provider (Claude via an inference profile)

## Project structure

```text
app/
  api/analyze/route.ts      POST /api/analyze
  globals.css
  layout.tsx
  page.tsx
components/clara/           Check flow and result UI
lib/
  analysis-schema.ts        Zod schemas
  clara-agent.ts            Strands + Bedrock agent
  demo-results.ts           Mock gift-card result and disclaimer
types/analysis.ts           ClaraRisk and ClaraAnalysis
.env.example                Empty AWS placeholders
```

## Local setup

1. Install [Node.js](https://nodejs.org/) 20 or later.
2. Clone the repository and create a feature branch. Do not work directly on `main`.
3. Install dependencies:

```bash
npm install
```

4. Copy the environment template:

```bash
cp .env.example .env.local
```

5. Leave `.env.local` empty to use the mock API, or fill it in to call Bedrock (see below).

Never put real AWS credentials in source code, `.env.example`, this README, or a commit. `.env.local` is ignored by Git.

## Run the development server

```bash
npm run dev
```

If port 3000 is already in use, Next.js will pick the next free port (often 3001). Open the URL shown in the terminal.

Enter or edit a suspicious message, then choose **Check it with Clara**. You can start over or open **Ask a trusted person**.

Other commands:

```bash
npm run lint
npm run build
npm start
```

Restart the development server after you change `.env.local`.

## Amazon Bedrock setup

Do this in the AWS account the team uses for the hackathon.

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/) and pick one region, such as `us-east-1`.
2. Open [Amazon Bedrock](https://console.aws.amazon.com/bedrock/).
3. In **Playground** → **Chat / Text**, select a Claude model and send `Hello`. Complete the Anthropic use-case form if AWS asks for it.
4. In [IAM](https://console.aws.amazon.com/iam/), create a user for the app (console login is optional). Attach `AmazonBedrockFullAccess`, then create an access key for **Application running outside AWS**.
5. Copy the **inference profile ID** from the Bedrock model card, not only the foundation model ID.

Newer Claude models (including Haiku 4.5) cannot be invoked with the bare model ID. If you see:

> Invocation of model ID … with on-demand throughput isn’t supported

change `BEDROCK_MODEL_ID` to the geo inference profile. Example for a US region:

```text
us.anthropic.claude-haiku-4-5-20251001-v1:0
```

Use `eu.…` if your region is in Europe. See the [Claude Haiku 4.5 model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-haiku-4-5.html).

## Environment variables

Set these in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | Region used by the Bedrock client, for example `us-east-1` |
| `AWS_ACCESS_KEY_ID` | IAM access key for the hackathon user |
| `AWS_SECRET_ACCESS_KEY` | Matching secret access key |
| `BEDROCK_MODEL_ID` | Inference profile ID, for example `us.anthropic.claude-haiku-4-5-20251001-v1:0` |

All four must be non-empty for Clara to call Bedrock. If any are missing, the API uses the mock result.

## How analysis works

1. The UI posts `{ type, content }` to `POST /api/analyze`.
2. The route validates `content` with Zod. Invalid input returns `400`.
3. If AWS is configured, `lib/clara-agent.ts` creates a Strands `Agent` with `BedrockModel` and `claraAnalysisSchema`.
4. The model must return `ClaraAnalysis`: `risk`, `headline`, `summary`, `warningSigns` (1–3 items), `safestNextStep`, `trustedPersonSummary`, and `disclaimer`.
5. Allowed `risk` values: `low_concern`, `caution`, `likely_scam`, `unclear`.
6. The product disclaimer is always applied, even if the model changes the wording.
7. If Bedrock fails, the API returns `502` with a short error. It does not silently return the gift-card mock.

Without AWS credentials, the route waits about one second and returns `lib/demo-results.ts`.

## How to tell Bedrock is working

Check two different messages:

- A gift-card or “your account is locked” scam should come back as high concern.
- A normal family text, such as “Hi Grandma, I will visit on Sunday,” should come back as `low_concern` or `caution`, not the same gift-card wording.

If both answers are identical gift-card copy, you are on the mock path.

## Privacy and safety principles

- Clara is a second-opinion tool, not a decision-maker.
- Users should pause before they click a link, reply, or send money.
- Do not tell people to use a number or link from the suspicious message.
- Do not store messages longer than needed to produce a result.
- Do not commit credentials, personal financial details, or production secrets.
- When something looks risky, the safest next step is to contact a bank, law enforcement, or a trusted person through a number the user already has.

Clara provides a second opinion. It does not guarantee that a message is safe, make financial decisions, or replace a bank, law enforcement, or a trusted person.

## Later work

- Screenshot analysis with real image bytes (multimodal Bedrock input)
- Prompt tuning after more demo examples
- Optional Amazon Bedrock AgentCore hosting (not required for the local demo)
