import type { Criterion, JobCriteria, JobInput, RagChunk } from "../types";

function listItems(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- 未填写";
}

function formatRagChunks(chunks: RagChunk[]): string {
  if (!chunks.length) return "无外部知识库补充内容。";
  return chunks
    .map((chunk, index) => {
      const score = typeof chunk.score === "number" ? `，相关度 ${chunk.score.toFixed(2)}` : "";
      return `${index + 1}. ${chunk.title}${score}\n来源: ${chunk.source ?? "外部RAG"}\n内容: ${chunk.content}`;
    })
    .join("\n\n");
}

function formatCriteriaGroup(title: string, criteria: Criterion[]): string {
  if (!criteria.length) return `${title}: 无`;
  return [
    `${title}:`,
    ...criteria.map(
      (criterion) =>
        `- [${criterion.id}] ${criterion.name}（权重 ${criterion.weight}，${criterion.required ? "必须" : "加分"}）：${criterion.description}`
    )
  ].join("\n");
}

export function buildJobStandardPrompt(input: JobInput, chunks: RagChunk[]): string {
  return `你是企业招聘专家，请根据内部JD、外部JD和外部RAG知识库补充，生成可由HR确认的岗位标准。\n\n岗位名称: ${input.title}\n部门: ${input.department ?? "未填写"}\n\n内部JD:\n${input.internalJd}\n\n外部JD:\n${input.externalJd}\n\n必须技能:\n${listItems(input.requiredSkills)}\n\n加分技能:\n${listItems(input.preferredSkills)}\n\n外部RAG知识库补充（仅用于生成岗位标准和提示词准备，禁止直接作为候选人结论证据）:\n${formatRagChunks(chunks)}\n\n请输出结构化岗位标准，包含岗位摘要、硬性要求、加分项、淘汰项、面试关注点和禁止使用的歧视性信号。`;
}

export function buildResumeScreeningPromptTemplate(criteria: JobCriteria): string {
  return `你是HR简历筛选助手。你将基于HR确认后的岗位标准筛选简历。\n\n岗位标准版本: v${criteria.version}\n岗位: ${criteria.title}\n岗位摘要: ${criteria.summary}\n\n${formatCriteriaGroup("硬性要求", criteria.mustHave)}\n\n${formatCriteriaGroup("加分项", criteria.niceToHave)}\n\n${formatCriteriaGroup("淘汰项", criteria.dealBreakers)}\n\n面试关注点:\n${listItems(criteria.interviewFocus)}\n\n合规要求:\n- 禁止使用年龄、性别、婚育、民族、籍贯、户籍、身份证、照片、身高体重等无关或受保护信息。\n- 每条判断必须引用简历原文证据。\n- 简历分析阶段禁止调用RAG、外部搜索或任何岗位知识库；只能使用锁定岗位标准、锁定筛选提示词和候选人简历文本。\n\n请输出JSON，字段包括 candidateName、recommendation、matchLevel、riskLevel、summary、matchReasons、risks、capabilityFindings、interviewAdvice、interviewQuestions、evidence。`;
}

export function buildResumeScreeningPrompt(criteria: JobCriteria): string {
  return `${buildResumeScreeningPromptTemplate(criteria)}\n\n再次确认：本次分析不会使用RAG知识库。RAG只允许在JD和Prompt Bundle准备阶段使用。`;
}
