import { describe, expect, it } from "vitest";
import { StaticAiProvider } from "../../src/domain/ai/aiProvider";
import { analyzeResume } from "../../src/domain/analysis/analysisService";
import { lockPromptBundle } from "../../src/domain/prompts/promptBundleService";
import { confirmCriteria, lockCriteria } from "../../src/domain/criteria/criteriaService";
import type { JobCriteria, PromptBundle, RagSnapshot } from "../../src/domain/types";
import type { RagProvider, RagRetrieveRequest } from "../../src/domain/rag/ragProvider";

const criteria: JobCriteria = lockCriteria(
  confirmCriteria(
    {
      version: 1,
      status: "draft",
      title: "招聘专员",
      summary: "负责招聘初筛和面试推进。",
      mustHave: [
        {
          id: "must-1",
          name: "简历筛选",
          description: "能根据岗位标准筛选简历。",
          weight: 20,
          required: true,
          evidenceRequired: true
        }
      ],
      niceToHave: [],
      dealBreakers: [],
      interviewFocus: ["招聘漏斗经验"],
      prohibitedSignals: ["age", "gender"]
    },
    "hr@example.com"
  )
);

const draftBundle: PromptBundle = {
  status: "draft",
  ragSnapshot: {
    provider: "fake-rag",
    query: "招聘专员",
    chunks: [],
    retrievedAt: "2026-06-21T00:00:00.000Z"
  },
  jobStandardPrompt: "岗位标准提示词",
  resumeScreeningPromptTemplate: "筛选提示词模板",
  generatedCriteria: criteria,
  createdAt: "2026-06-21T00:00:00.000Z"
};

const report = {
  candidateName: "张三",
  recommendation: "recommend" as const,
  matchLevel: "match" as const,
  riskLevel: "low" as const,
  summary: "候选人具备招聘初筛经验。",
  matchReasons: ["具备简历筛选经验"],
  risks: [],
  capabilityFindings: [
    {
      criterionId: "must-1",
      criterionName: "简历筛选",
      score: 85,
      rationale: "简历中有批量筛选经验。",
      evidence: [
        {
          criterionId: "must-1",
          source: "resume" as const,
          quote: "负责每日筛选80份简历",
          explanation: "体现简历筛选经验。",
          confidence: 0.9
        }
      ]
    }
  ],
  interviewAdvice: ["追问筛选标准制定方法"],
  interviewQuestions: ["请介绍一次高峰期简历筛选项目。"],
  evidence: [
    {
      criterionId: "must-1",
      source: "resume" as const,
      quote: "负责每日筛选80份简历",
      explanation: "体现简历筛选经验。",
      confidence: 0.9
    }
  ]
};

class ThrowingRagProvider implements RagProvider {
  readonly name = "throwing-rag";

  async retrieve(_request: RagRetrieveRequest): Promise<RagSnapshot> {
    throw new Error("RAG must not be called during resume analysis");
  }
}

describe("resume analysis guard", () => {
  it("requires locked criteria and locked prompt bundle", async () => {
    await expect(
      analyzeResume({
        criteria: { ...criteria, status: "confirmed" },
        promptBundle: lockPromptBundle(draftBundle, criteria),
        resume: { originalName: "resume.txt", mimeType: "text/plain", parsedText: "负责每日筛选80份简历" },
        aiProvider: new StaticAiProvider(report)
      })
    ).rejects.toThrow("岗位标准锁定后才能分析简历");
  });

  it("does not call RAG during resume analysis", async () => {
    const result = await analyzeResume({
      criteria,
      promptBundle: lockPromptBundle(draftBundle, criteria),
      resume: { originalName: "resume.txt", mimeType: "text/plain", parsedText: "负责每日筛选80份简历" },
      aiProvider: new StaticAiProvider(report),
      ragProvider: new ThrowingRagProvider()
    });

    expect(result.recommendation).toBe("recommend");
    expect(result.evidence[0]?.source).toBe("resume");
  });
});
