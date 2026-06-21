import type { Criterion, JobCriteria, JobInput, PromptBundle, RagSnapshot } from "../types";
import { retrieveKnowledge } from "../rag/ragService";
import { EmptyRagProvider, type RagProvider } from "../rag/ragProvider";
import { buildJobStandardPrompt, buildResumeScreeningPrompt, buildResumeScreeningPromptTemplate } from "./promptTemplates";

function toCriterion(prefix: string, name: string, index: number, required: boolean): Criterion {
  return {
    id: `${prefix}-${index + 1}`,
    name,
    description: `候选人简历需要体现与“${name}”相关的项目、职责或成果。`,
    weight: required ? 20 : 10,
    required,
    evidenceRequired: true
  };
}

export function generateDraftCriteria(input: JobInput, ragSnapshot: RagSnapshot): JobCriteria {
  const mustHave = input.requiredSkills.map((skill, index) => toCriterion("must", skill, index, true));
  const niceToHave = input.preferredSkills.map((skill, index) => toCriterion("nice", skill, index, false));

  return {
    jobId: input.jobId,
    version: 1,
    status: "draft",
    title: input.title,
    summary: `${input.title}岗位标准草案，结合内部JD、外部JD${ragSnapshot.chunks.length ? "和外部知识库补充" : ""}生成。`,
    mustHave,
    niceToHave,
    dealBreakers: [
      {
        id: "deal-1",
        name: "缺少关键岗位经验",
        description: "简历没有体现核心职责、关键技能或相近岗位经验。",
        weight: 30,
        required: true,
        evidenceRequired: true
      }
    ],
    interviewFocus: ["过往项目中的实际职责", "关键技能的熟练程度", "与岗位目标相关的可验证成果"],
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
}

export async function createPromptBundle(
  input: JobInput,
  ragProvider: RagProvider = new EmptyRagProvider()
): Promise<PromptBundle> {
  const ragSnapshot = await retrieveKnowledge({ ...input, topK: 5 }, ragProvider);
  const generatedCriteria = generateDraftCriteria(input, ragSnapshot);
  const resumeScreeningPromptTemplate = buildResumeScreeningPromptTemplate(generatedCriteria);

  return {
    jobId: input.jobId,
    status: "draft",
    ragSnapshot,
    jobStandardPrompt: buildJobStandardPrompt(input, ragSnapshot.chunks),
    resumeScreeningPromptTemplate,
    finalResumeScreeningPrompt: buildResumeScreeningPrompt(generatedCriteria),
    generatedCriteria,
    createdAt: new Date().toISOString()
  };
}

export function regenerateScreeningPromptFromCriteria(bundle: PromptBundle, criteria: JobCriteria): PromptBundle {
  return {
    ...bundle,
    generatedCriteria: criteria,
    resumeScreeningPromptTemplate: buildResumeScreeningPromptTemplate(criteria),
    finalResumeScreeningPrompt: buildResumeScreeningPrompt(criteria)
  };
}

export function lockPromptBundle(bundle: PromptBundle, criteria: JobCriteria): PromptBundle {
  if (criteria.status !== "locked") {
    throw new Error("岗位标准锁定后才能锁定简历筛选提示词");
  }

  return {
    ...regenerateScreeningPromptFromCriteria(bundle, criteria),
    status: "locked",
    lockedAt: new Date().toISOString()
  };
}
