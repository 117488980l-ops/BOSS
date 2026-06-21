export type CriteriaStatus = "draft" | "confirmed" | "locked";
export type PromptBundleStatus = "draft" | "locked";
export type MatchLevel = "strong_match" | "match" | "possible" | "weak";
export type RiskLevel = "low" | "medium" | "high";
export type Recommendation = "recommend" | "hold" | "reject";

export type ProhibitedSignalCategory =
  | "age"
  | "gender"
  | "marital_status"
  | "fertility_status"
  | "ethnicity"
  | "birthplace"
  | "household_registration"
  | "unrelated_identity";

export interface JobInput {
  jobId?: string;
  title: string;
  department?: string;
  internalJd: string;
  externalJd: string;
  requiredSkills: string[];
  preferredSkills: string[];
}

export interface RagChunk {
  id: string;
  title: string;
  content: string;
  source?: string;
  score?: number;
}

export interface RagSnapshot {
  provider: string;
  query: string;
  chunks: RagChunk[];
  retrievedAt: string;
  metadata?: Record<string, unknown>;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  required: boolean;
  evidenceRequired: boolean;
}

export interface JobCriteria {
  id?: string;
  jobId?: string;
  version: number;
  status: CriteriaStatus;
  title: string;
  summary: string;
  mustHave: Criterion[];
  niceToHave: Criterion[];
  dealBreakers: Criterion[];
  interviewFocus: string[];
  prohibitedSignals: ProhibitedSignalCategory[];
  confirmedBy?: string;
  confirmedAt?: string;
  lockedAt?: string;
}

export interface PromptBundle {
  id?: string;
  jobId?: string;
  status: PromptBundleStatus;
  ragSnapshot: RagSnapshot;
  jobStandardPrompt: string;
  resumeScreeningPromptTemplate: string;
  finalResumeScreeningPrompt?: string;
  generatedCriteria: JobCriteria;
  createdAt: string;
  lockedAt?: string;
}

export interface ResumeDocument {
  id?: string;
  originalName: string;
  mimeType: string;
  storagePath?: string;
  parsedText: string;
}

export interface EvidenceItem {
  criterionId?: string;
  source: "resume";
  quote: string;
  explanation: string;
  confidence: number;
}

export interface CapabilityFinding {
  criterionId: string;
  criterionName: string;
  score: number;
  rationale: string;
  evidence: EvidenceItem[];
}

export interface AnalysisReportJson {
  candidateName?: string;
  recommendation: Recommendation;
  matchLevel: MatchLevel;
  riskLevel: RiskLevel;
  summary: string;
  matchReasons: string[];
  risks: string[];
  capabilityFindings: CapabilityFinding[];
  interviewAdvice: string[];
  interviewQuestions: string[];
  evidence: EvidenceItem[];
}
