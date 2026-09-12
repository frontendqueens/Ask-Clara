import { NextResponse } from "next/server";
import { analyzeRequestSchema, claraAnalysisSchema } from "@/lib/analysis-schema";
import { demoGiftCardScamResult } from "@/lib/demo-results";

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

  // BEDROCK INTEGRATION POINT:
  // Replace the simulated delay and mock result below with an Amazon Bedrock
  // Runtime request (InvokeModel) using AWS_REGION, AWS_ACCESS_KEY_ID,
  // AWS_SECRET_ACCESS_KEY, and BEDROCK_MODEL_ID. Validate the model output
  // with claraAnalysisSchema before returning it to the client.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const result = claraAnalysisSchema.parse(demoGiftCardScamResult);

  return NextResponse.json(result);
}
