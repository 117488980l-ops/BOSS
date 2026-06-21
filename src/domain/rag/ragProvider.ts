import type { JobInput, RagSnapshot } from "../types";

export interface RagRetrieveRequest extends JobInput {
  topK?: number;
}

export interface RagProvider {
  readonly name: string;
  retrieve(request: RagRetrieveRequest): Promise<RagSnapshot>;
}

export function buildRagQuery(request: RagRetrieveRequest): string {
  const skills = [...request.requiredSkills, ...request.preferredSkills].filter(Boolean).join("、");
  return [
    `岗位: ${request.title}`,
    request.department ? `部门: ${request.department}` : "",
    skills ? `技能: ${skills}` : "",
    `内部JD: ${request.internalJd}`,
    `外部JD: ${request.externalJd}`
  ]
    .filter(Boolean)
    .join("\n");
}

export class EmptyRagProvider implements RagProvider {
  readonly name = "empty";

  async retrieve(request: RagRetrieveRequest): Promise<RagSnapshot> {
    return {
      provider: this.name,
      query: buildRagQuery(request),
      chunks: [],
      retrievedAt: new Date().toISOString(),
      metadata: { reason: "No external RAG provider configured", topK: request.topK ?? 5 }
    };
  }
}
