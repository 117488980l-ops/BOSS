"use server";

import { confirmCriteria, lockCriteria } from "@/domain/criteria/criteriaService";
import type { Criterion, JobCriteria } from "@/domain/types";
import { fail, ok, type ActionResult } from "@/lib/result";

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCriteria(prefix: string, values: string[], required: boolean): Criterion[] {
  return values.map((value, index) => ({
    id: `${prefix}-${index + 1}`,
    name: value,
    description: `HR调整后的岗位标准项：${value}`,
    weight: required ? 20 : 10,
    required,
    evidenceRequired: true
  }));
}

export async function confirmAndLockStandard(formData: FormData): Promise<ActionResult<{ criteria: JobCriteria }>> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const mustHave = lines(formData.get("mustHave"));

  if (!title || !summary || mustHave.length === 0) {
    return fail("岗位名称、岗位摘要和硬性要求都需要填写");
  }

  const draft: JobCriteria = {
    jobId: String(formData.get("jobId") ?? "demo-job"),
    version: Number(formData.get("version") ?? 1),
    status: "draft",
    title,
    summary,
    mustHave: toCriteria("must", mustHave, true),
    niceToHave: toCriteria("nice", lines(formData.get("niceToHave")), false),
    dealBreakers: toCriteria("deal", lines(formData.get("dealBreakers")), true),
    interviewFocus: lines(formData.get("interviewFocus")),
    prohibitedSignals: [
      "age",
      "gender",
      "marital_status",
      "fertility_status",
      "ethnicity",
      "birthplace",
      "household_registration",
      "unrelated_identity"
    ]
  };

  const confirmed = confirmCriteria(draft, String(formData.get("confirmedBy") ?? "hr@example.com"));
  return ok({ criteria: lockCriteria(confirmed) });
}
