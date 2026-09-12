import { Agent, BedrockModel, ImageBlock, TextBlock } from "@strands-agents/sdk";
import type { ImageFormat } from "@strands-agents/sdk";
import {
  type AnalyzeRequest,
  claraAnalysisSchema,
} from "@/lib/analysis-schema";
import { CLARA_DISCLAIMER } from "@/lib/demo-results";
import type { ScreenshotMediaType } from "@/lib/screenshot";
import type { ClaraAnalysis } from "@/types/analysis";

const CLARA_SYSTEM_PROMPT = `You are Clara, an accessible safety companion for older adults.
A person will show you a suspicious message, a screenshot of a message, or describe what happened.
Give a calm second opinion in plain language.

Rules:
- Never say the message is safe or guaranteed to be genuine.
- Never tell the person to click a link, reply to the sender, call a number from the message, or send money.
- Prefer calling a number they already have, such as the number on the back of a bank card, or asking a trusted person.
- Do not invent facts about the sender.
- If the message is incomplete, unreadable, or confusing, use risk "unclear".
- If you are given a screenshot, read only the text you can see. Do not invent wording that is not in the image.
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

function imageFormatFromMediaType(mediaType: ScreenshotMediaType): ImageFormat {
  switch (mediaType) {
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
  }
}

function decodeImageData(data: string): Uint8Array {
  const base64 = data.includes(",") ? (data.split(",").pop() ?? "") : data;
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

function buildUserPrompt(input: AnalyzeRequest): string {
  if (input.type === "tell") {
    return `The person described what happened in their own words:\n\n${input.content}`;
  }

  if (input.type === "screenshot") {
    return "The person uploaded a screenshot of a message. Read the text in the image. If you cannot read it, use risk unclear.";
  }

  return `The person pasted or described this message:\n\n${input.content}`;
}

export async function analyzeWithClara(
  input: AnalyzeRequest,
): Promise<ClaraAnalysis> {
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

  const prompt = buildUserPrompt(input);
  const invocation =
    input.image !== undefined
      ? [
          new TextBlock(prompt),
          new ImageBlock({
            format: imageFormatFromMediaType(input.image.mediaType),
            source: { bytes: decodeImageData(input.image.data) },
          }),
        ]
      : prompt;

  const result = await agent.invoke(invocation, {
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
