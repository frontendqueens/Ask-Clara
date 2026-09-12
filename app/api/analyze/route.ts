import { NextResponse } from "next/server";
import { analyzeRequestSchema, claraAnalysisSchema } from "@/lib/analysis-schema";
import {
  analyzeWithClara,
  isClaraBedrockConfigured,
} from "@/lib/clara-agent";
import { demoGiftCardScamResult } from "@/lib/demo-results";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON with a content field." },
      { status: 400 },
    );
  }

  const parsedRequest = analyzeRequestSchema.safeParse(body);

  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "content is required and must be a non-empty string." },
      { status: 400 },
    );
  }

  if (!isClaraBedrockConfigured()) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json(claraAnalysisSchema.parse(demoGiftCardScamResult));
  }

  try {
    const analysis = await analyzeWithClara(parsedRequest.data);
    return NextResponse.json(claraAnalysisSchema.parse(analysis));
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Clara could not check this message with Bedrock.";

    return NextResponse.json(
      {
        error:
          "Clara could not reach Amazon Bedrock. Check AWS_REGION, BEDROCK_MODEL_ID, and your access keys, then restart the dev server.",
        detail: message,
      },
      { status: 502 },
    );
  }
}
