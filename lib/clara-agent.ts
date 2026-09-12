import { Agent, BedrockModel } from "@strands-agents/sdk";
import { claraAnalysisSchema } from "@/lib/analysis-schema";
import { CLARA_DISCLAIMER } from "@/lib/demo-results";
import type { ClaraAnalysis } from "@/types/analysis";

const CLARA_SYSTEM_PROMPT = `You are Clara, an accessible safety companion for older adults.
A person will show you a suspicious message or describe what happened.
Give a calm second opinion in plain language.

Rules:
- Never say the message is safe or guaranteed to be genuine.
- Never tell the person to click a link, reply to the sender, call a number from the message, or send money.
- Prefer calling a number they already have, such as the number on the back of a bank card, or asking a trusted person.
- Do not invent facts about the sender.
- If the message is incomplete or confusing, use risk "unclear".
- Write short sentences. Avoid jargon.
- warningSigns must contain between 1 and 3 items.
- trustedPersonSummary should be written as if the person is asking a relative for help.
- Always include this exact disclaimer: ${CLARA_DISCLAIMER}`;

function envValue(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

function bedrockConfig() {
  return {
    region: envValue("AWS_REGION", "CLARA_AWS_REGION"),
    modelId: envValue("BEDROCK_MODEL_ID"),
    accessKeyId: envValue("AWS_ACCESS_KEY_ID", "CLARA_AWS_ACCESS_KEY_ID"),
    secretAccessKey: envValue(
      "AWS_SECRET_ACCESS_KEY",
      "CLARA_AWS_SECRET_ACCESS_KEY",
    ),
  };
}

export function isClaraBedrockConfigured(): boolean {
  const config = bedrockConfig();

  return Boolean(
    config.region &&
      config.modelId &&
      config.accessKeyId &&
      config.secretAccessKey,
  );
}

function buildUserPrompt(type: string | undefined, content: string): string {
  const source =
    type === "screenshot"
      ? "The person uploaded a screenshot. This is the available description:"
      : "The person pasted or described this message:";

  return `${source}\n\n${content}`;
}

export async function analyzeWithClara(input: {
  type?: string;
  content: string;
}): Promise<ClaraAnalysis> {
  const { region, modelId, accessKeyId, secretAccessKey } = bedrockConfig();

  if (!region || !modelId || !accessKeyId || !secretAccessKey) {
    throw new Error("Bedrock is not configured.");
  }

  const model = new BedrockModel({
    modelId,
    region,
    temperature: 0.2,
    maxTokens: 1024,
    stream: false,
    clientConfig: {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    },
  });

  const agent = new Agent({
    model,
    systemPrompt: CLARA_SYSTEM_PROMPT,
    structuredOutputSchema: claraAnalysisSchema,
    printer: false,
  });

  const result = await agent.invoke(buildUserPrompt(input.type, input.content), {
    structuredOutputSchema: claraAnalysisSchema,
  });

  const parsed = claraAnalysisSchema.safeParse(result.structuredOutput);

  if (!parsed.success) {
    throw new Error("Clara could not produce a valid analysis.");
  }

  return {
    ...parsed.data,
    disclaimer: CLARA_DISCLAIMER,
  };
}
