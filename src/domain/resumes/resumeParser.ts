export interface ParsedResume {
  originalName: string;
  mimeType: string;
  text: string;
}

export interface ResumeFileInput {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
}

export function normalizeResumeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function parsePlainTextResume(originalName: string, text: string, mimeType = "text/plain"): ParsedResume {
  return {
    originalName,
    mimeType,
    text: normalizeResumeText(text)
  };
}

export async function parseResumeFile(input: ResumeFileInput): Promise<ParsedResume> {
  if (input.mimeType === "text/plain") {
    return parsePlainTextResume(input.originalName, input.buffer.toString("utf8"), input.mimeType);
  }

  if (input.mimeType === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(input.buffer);
    return parsePlainTextResume(input.originalName, result.text, input.mimeType);
  }

  if (input.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: input.buffer });
    return parsePlainTextResume(input.originalName, result.value, input.mimeType);
  }

  throw new Error(`不支持的简历文件类型: ${input.mimeType}`);
}
