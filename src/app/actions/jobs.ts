"use server";

import { createPromptBundle } from "@/domain/prompts/promptBundleService";
import { EmptyRagProvider } from "@/domain/rag/ragProvider";
import type { PromptBundle } from "@/domain/types";
import { fail, ok, type ActionResult } from "@/lib/result";

function requiredText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function prepareJobPromptBundle(formData: FormData): Promise<ActionResult<{ bundle: PromptBundle }>> {
  const title = requiredText(formData, "title");
  const internalJd = requiredText(formData, "internalJd");
  const externalJd = requiredText(formData, "externalJd");

  if (!title || !internalJd || !externalJd) {
    return fail("岗位名称、内部JD和外部JD都需要填写");
  }

  const bundle = await createPromptBundle(
    {
      title,
      department: requiredText(formData, "department") || undefined,
      internalJd,
      externalJd,
      requiredSkills: parseList(requiredText(formData, "requiredSkills")),
      preferredSkills: parseList(requiredText(formData, "preferredSkills"))
    },
    new EmptyRagProvider()
  );

  return ok({ bundle });
}
