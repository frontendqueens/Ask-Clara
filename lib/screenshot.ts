export const MAX_SCREENSHOT_BYTES = 3.5 * 1024 * 1024;

export const SCREENSHOT_MEDIA_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type ScreenshotMediaType = (typeof SCREENSHOT_MEDIA_TYPES)[number];

export type ScreenshotImagePayload = {
  mediaType: ScreenshotMediaType;
  data: string;
};

function isScreenshotMediaType(value: string): value is ScreenshotMediaType {
  return SCREENSHOT_MEDIA_TYPES.includes(value as ScreenshotMediaType);
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

export async function fileToScreenshotImage(
  file: File,
): Promise<ScreenshotImagePayload> {
  if (!isScreenshotMediaType(file.type)) {
    throw new Error("Please use a JPEG, PNG, WebP, or GIF screenshot.");
  }

  if (file.size > MAX_SCREENSHOT_BYTES) {
    throw new Error("Please choose a screenshot smaller than 3.5 MB.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  return {
    mediaType: file.type,
    data: bytesToBase64(bytes),
  };
}
