import { describe, expect, it } from "vitest";
import { StaticAiProvider } from "../../src/domain/ai/aiProvider";
import { analyzeResume } from "../../src/domain/analysis/analysisService";
import { confirmCriteria, lockCriteria } from "../../src/domain/criteria/criteriaService";
import { createPromptBundle, lockPromptBundle } from "../../src/domain/prompts/promptBundleService";
import { prepareResumeUpload } from "../../src/domain/resumes/resumeService";
import type { RagProvider, RagRetrieveRequest } from "../../src/domain/rag/ragProvider";
import type { RagSnapshot } from "../../src/domain/types";

class CountingRagProvider implements RagProvider {
  readonly name = "counting-rag";
  calls = 0;

  async retrieve(request: RagRetrieveRequest): Promise<RagSnapshot> {
    this.calls += 1;
    return {
      provider: this.name,
      query: request.title,
      chunks: [
        {
          id: "rag-1",
          title: "HR筛选指标",
          content: "岗位标准应关注硬性技能、可验证项目证据和结构化面试问题。",
          source: "external-rag",
          score: 0.88
        }
      ],
      retrievedAt: "2026-06-21T00:00:00.000Z"
    };
  }
}

const aiReport = {
  candidateName: "李四",
  recommendation: "recommend" as const,
  matchLevel: "strong_match" as const,
  riskLevel: "low" as const,
  summary: "候选人匹配招聘专员岗位。",
  matchReasons: ["有批量简历筛选和面试推进经验"],
  risks: ["需要确认招聘数据分析深度"],
  capabilityFindings: [
    {
      criterionId: "must-1",
      criterionName: "简历筛选",
      score: 90,
      rationale: "候选人有明确筛选量和渠道经验。",
      evidence: [
        {
          criterionId: "must-1",
          source: "resume" as const,
          quote: "负责BOSS直聘渠道，每周筛选300份简历",
          explanation: "体现批量筛选能力。",
          confidence: 0.92
        }
      ]
    }
  ],
  interviewAdvice: ["核实筛选标准和质量控制方法"],
  interviewQuestions: ["你如何定义一份简历是否进入面试？"],
  evidence: [
    {
      criterionId: "must-1",
      source: "resume" as const,
      quote: "负责BOSS直聘渠道，每周筛选300份简历",
      explanation: "体现批量筛选能力。",
      confidence: 0.92
    }
  ]
};

describe("ESSA HR full workflow", () => {
  it("uses external RAG before analysis and never during resume analysis", async () => {
    const rag = new CountingRagProvider();
    const bundle = await createPromptBundle(
      {
        title: "招聘专员",
        department: "人力资源部",
        internalJd: "负责候选人初筛、面试推进和招聘数据沉淀。",
        externalJd: "熟悉BOSS直聘和结构化面试，有招聘漏斗意识。",
        requiredSkills: ["简历筛选", "面试推进"],
        preferredSkills: ["招聘数据分析"]
      },
      rag
    );

    const confirmed = confirmCriteria(bundle.generatedCriteria, "hr@example.com");
    const lockedCriteria = lockCriteria(confirmed);
    const lockedBundle = lockPromptBundle(bundle, lockedCriteria);
    const resume = prepareResumeUpload({
      originalName: "li-si.txt",
      mimeType: "text/plain",
      rawText: "负责BOSS直聘渠道，每周筛选300份简历，并协调业务面试。"
    });

    const report = await analyzeResume({
      criteria: lockedCriteria,
      promptBundle: lockedBundle,
      resume,
      aiProvider: new StaticAiProvider(aiReport),
      ragProvider: rag
    });

    expect(rag.calls).toBe(1);
    expect(lockedBundle.finalResumeScreeningPrompt).toContain("简历分析阶段禁止调用RAG");
    expect(report.matchLevel).toBe("strong_match");
    expect(report.evidence[0]?.source).toBe("resume");
  });
});
