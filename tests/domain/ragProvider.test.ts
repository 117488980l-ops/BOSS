import { describe, expect, it } from "vitest";
import { EmptyRagProvider } from "../../src/domain/rag/ragProvider";
import { retrieveKnowledge } from "../../src/domain/rag/ragService";

const jobInput = {
  title: "高级前端工程师",
  department: "产品技术部",
  internalJd: "负责招聘系统前端架构和交互体验。",
  externalJd: "需要React、TypeScript、复杂表单经验。",
  requiredSkills: ["React", "TypeScript"],
  preferredSkills: ["Next.js"]
};

describe("EmptyRagProvider", () => {
  it("returns a valid empty snapshot when no external RAG is configured", async () => {
    const snapshot = await retrieveKnowledge(jobInput, new EmptyRagProvider());

    expect(snapshot.provider).toBe("empty");
    expect(snapshot.query).toContain("高级前端工程师");
    expect(snapshot.query).toContain("React");
    expect(snapshot.chunks).toEqual([]);
    expect(snapshot.retrievedAt).toEqual(expect.any(String));
  });
});
