import type { AiProvider } from "../ai/aiProvider";
import type { JobCriteria, PromptBundle, ResumeDocument, AnalysisReportJson } from "../types";
import type { RagProvider } from "../rag/ragProvider";
import { analysisReportSchema } from "./analysisSchema";
import { buildResumeScreeningPrompt } from "../prompts/promptTemplates";

export interface AnalyzeResumeRequest {
  criteria: JobCriteria;
  promptBundle: PromptBundle;
  resume: ResumeDocument;
  aiProvider: AiProvider;
  ragProvider?: RagProvider;
}

export async function analyzeResume(request: AnalyzeResumeRequest): Promise<AnalysisReportJson> {
  const { criteria, promptBundle, resume, aiProvider } = request;

  if (criteria.status !== "locked") {
    throw new Error("岗位标准锁定后才能分析简历");
  }

  if (promptBundle.status !== "locked") {
    throw new Error("筛选提示词锁定后才能分析简历");
  }

  const systemPrompt = promptBundle.finalResumeScreeningPrompt ?? buildResumeScreeningPrompt(criteria);
  const rawReport = await aiProvider.completeJson<AnalysisReportJson>({
    schemaName: "AnalysisReportJson",
    system: systemPrompt,
    user: `请只基于以下简历文本完成筛选分析，不要调用RAG或外部知识库。\n\n简历文件: ${resume.originalName}\n\n${resume.parsedText}`
  });

  return analysisReportSchema.parse(rawReport);
}
