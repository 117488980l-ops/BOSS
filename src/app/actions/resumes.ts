"use server";

import { prepareResumeUpload } from "@/domain/resumes/resumeService";
import type { ResumeDocument } from "@/domain/types";
import { fail, ok, type ActionResult } from "@/lib/result";

async function readUploadedFile(value: FormDataEntryValue | null): Promise<{ text: string; name: string; mimeType: string } | null> {
  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) return null;

  return {
    text: await value.text(),
    name: value.name,
    mimeType: value.type || "text/plain"
  };
}

export async function analyzeResumeAction(formData: FormData): Promise<ActionResult<{ resume: ResumeDocument; queued: boolean }>> {
  const uploaded = await readUploadedFile(formData.get("resumeFile"));
  const pastedText = String(formData.get("resumeText") ?? "").trim();
  const rawText = uploaded?.text.trim() || pastedText;

  if (!rawText) {
    return fail("请上传简历文件或粘贴简历文本");
  }

  const resume = prepareResumeUpload({
    originalName: uploaded?.name ?? "pasted-resume.txt",
    mimeType: uploaded?.mimeType ?? "text/plain",
    storagePath: `local://uploads/${uploaded?.name ?? "pasted-resume.txt"}`,
    rawText
  });

  return ok({ resume, queued: true });
}
