import { z } from "zod";

export const evidenceItemSchema = z.object({
  criterionId: z.string().optional(),
  source: z.literal("resume"),
  quote: z.string().min(1),
  explanation: z.string().min(1),
  confidence: z.number().min(0).max(1)
});

export const capabilityFindingSchema = z.object({
  criterionId: z.string(),
  criterionName: z.string(),
  score: z.number().min(0).max(100),
  rationale: z.string(),
  evidence: z.array(evidenceItemSchema)
});

export const analysisReportSchema = z.object({
  candidateName: z.string().optional(),
  recommendation: z.enum(["recommend", "hold", "reject"]),
  matchLevel: z.enum(["strong_match", "match", "possible", "weak"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  summary: z.string().min(1),
  matchReasons: z.array(z.string()),
  risks: z.array(z.string()),
  capabilityFindings: z.array(capabilityFindingSchema),
  interviewAdvice: z.array(z.string()),
  interviewQuestions: z.array(z.string()),
  evidence: z.array(evidenceItemSchema)
});

export type AnalysisReportSchema = z.infer<typeof analysisReportSchema>;
