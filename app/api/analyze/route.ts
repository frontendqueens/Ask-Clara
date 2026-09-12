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
          "Clara could not reach Amazon Bedrock. Check the region, BEDROCK_MODEL_ID, and access keys. On Amplify use CLARA_AWS_REGION, CLARA_AWS_ACCESS_KEY_ID, and CLARA_AWS_SECRET_ACCESS_KEY.",
        detail: message,
      },
      { status: 502 },
    );
  }
}
