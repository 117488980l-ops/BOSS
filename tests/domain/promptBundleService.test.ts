import { describe, expect, it } from "vitest";
import type { RagProvider, RagRetrieveRequest } from "../../src/domain/rag/ragProvider";
import type { RagSnapshot } from "../../src/domain/types";
import { createPromptBundle, regenerateScreeningPromptFromCriteria } from "../../src/domain/prompts/promptBundleService";

const input = {
  title: "招聘专员",
  department: "人力资源部",
  internalJd: "负责候选人初筛、面试安排和招聘数据沉淀。",
  externalJd: "要求熟悉BOSS直聘、猎聘等渠道，有结构化面试经验。",
  requiredSkills: ["简历筛选", "结构化面试"],
  preferredSkills: ["招聘数据分析"]
};

class FakeRagProvider implements RagProvider {
  readonly name = "fake-rag";
  calls = 0;

  async retrieve(request: RagRetrieveRequest): Promise<RagSnapshot> {
    this.calls += 1;
    return {
      provider: this.name,
      query: request.title,
      chunks: [
        {
          id: "chunk-1",
          title: "招聘漏斗指标",
          content: "关注简历通过率、面试到场率和offer接受率。",
          source: "external-rag",
          score: 0.91
        }
      ],
      retrievedAt: "2026-06-21T00:00:00.000Z"
    };
  }
}

describe("prompt bundle service", () => {
  it("uses RAG during prompt preparation and excludes RAG chunks from final resume screening prompt", async () => {
    const rag = new FakeRagProvider();
    const bundle = await createPromptBundle(input, rag);

    expect(rag.calls).toBe(1);
    expect(bundle.jobStandardPrompt).toContain("招聘漏斗指标");
    expect(bundle.finalResumeScreeningPrompt).toContain("简历分析阶段禁止调用RAG");
    expect(bundle.finalResumeScreeningPrompt).not.toContain("offer接受率");
  });

  it("regenerates screening prompt when HR adjusts criteria", async () => {
    const bundle = await createPromptBundle(input, new FakeRagProvider());
    const adjustedCriteria = {
      ...bundle.generatedCriteria,
      mustHave: [
        ...bundle.generatedCriteria.mustHave,
        {
          id: "must-custom",
          name: "高峰期批量筛选经验",
          description: "能在招聘高峰期稳定处理大量简历。",
          weight: 15,
          required: true,
          evidenceRequired: true
        }
      ]
    };

    const updated = regenerateScreeningPromptFromCriteria(bundle, adjustedCriteria);

    expect(updated.finalResumeScreeningPrompt).toContain("高峰期批量筛选经验");
  });
});
