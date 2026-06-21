import type { ResumeDocument } from "../types";
import { parsePlainTextResume } from "./resumeParser";

export interface PrepareResumeUploadInput {
  originalName: string;
  mimeType: string;
  storagePath?: string;
  rawText: string;
}

export function prepareResumeUpload(input: PrepareResumeUploadInput): ResumeDocument {
  const parsed = parsePlainTextResume(input.originalName, input.rawText, input.mimeType);

  return {
    originalName: input.originalName,
    mimeType: input.mimeType,
    storagePath: input.storagePath,
    parsedText: parsed.text
  };
}
