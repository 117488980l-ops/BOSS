# ESSA HR MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ESSA HR MVP workflow from JD input through RAG-assisted prompt preparation, HR-confirmed standards, resume upload, evidence-based analysis, and Chinese candidate results.

**Architecture:** A single Next.js TypeScript app owns UI routes, server actions, domain services, and API boundaries. PostgreSQL and Prisma store versioned jobs, RAG snapshots, Prompt Bundles, job criteria, resumes, candidates, analysis reports, and evidence. RAG is only callable during Prompt Bundle preparation; resume analysis uses locked criteria, locked prompts, and resume text only.

**Tech Stack:** Next.js, TypeScript, React, Prisma, PostgreSQL, Vitest, React Testing Library, Playwright, PDF/DOCX text extraction, server-side AI provider adapters, Docker Compose.

---

## Implementation Milestones

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `docker-compose.yml`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/components/AppNav.tsx`
- Create: `src/components/StatusBadge.tsx`

- [ ] Create a Next.js TypeScript app scaffold.
- [ ] Add Chinese app shell and navigation.
- [ ] Add local PostgreSQL Docker Compose config.
- [ ] Run `npm install` and `npm run build`.
- [ ] Commit with `chore: scaffold ESSA HR app`.

### Task 2: Database Schema

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`

- [ ] Add Prisma models for `jobs`, `rag_retrieval_logs`, `prompt_bundles`, `job_criteria_versions`, `resumes`, `candidates`, `analysis_reports`, and `analysis_evidence`.
- [ ] Add status enums for job, bundle, criteria, resume, and analysis lifecycle.
- [ ] Add Prisma client singleton.
- [ ] Run `npm run prisma:generate` and `npm run prisma:migrate -- --name init`.
- [ ] Commit with `feat: add ESSA HR data model`.

### Task 3: Domain Types and Guard Rails

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/security/prohibitedSignals.ts`
- Test: `tests/domain/prohibitedSignals.test.ts`

- [ ] Define `JobCriteria`, `AnalysisReportJson`, `EvidenceItem`, match levels, risk levels, and lock statuses.
- [ ] Add prohibited-signal detection for age, gender, marital status, fertility status, ethnicity, birthplace, household registration, and unrelated identity data.
- [ ] Add tests confirming protected attributes are flagged and job-relevant experience is not flagged.
- [ ] Commit with `feat: add domain guard rails`.

### Task 4: RAG Provider Interface

**Files:**
- Create: `src/domain/rag/ragProvider.ts`
- Create: `src/domain/rag/ragService.ts`
- Test: `tests/domain/ragProvider.test.ts`

- [ ] Add `RagProvider` interface.
- [ ] Add `EmptyRagProvider` so MVP can run without an external knowledge service.
- [ ] Add `retrieveKnowledge` service boundary.
- [ ] Add tests verifying empty RAG returns a valid empty snapshot.
- [ ] Commit with `feat: add external rag adapter boundary`.

### Task 5: Prompt Bundle Service

**Files:**
- Create: `src/domain/prompts/promptTemplates.ts`
- Create: `src/domain/prompts/promptBundleService.ts`
- Test: `tests/domain/promptBundleService.test.ts`

- [ ] Build job-standard generation prompt from internal JD, external JD, required skills, preferred skills, and RAG chunks.
- [ ] Build resume-screening prompt from HR-adjusted criteria.
- [ ] Ensure the final screening prompt explicitly says resume analysis must not call RAG and must cite resume evidence.
- [ ] Add tests proving RAG is only included in prompt preparation.
- [ ] Commit with `feat: add prompt bundle builders`.

### Task 6: Criteria Locking

**Files:**
- Create: `src/domain/criteria/criteriaService.ts`
- Test: `tests/domain/criteriaService.test.ts`

- [ ] Add confirm and lock transitions for job criteria.
- [ ] Block locking until HR has confirmed criteria.
- [ ] Block editing locked criteria directly.
- [ ] Add tests for confirm-before-lock behavior.
- [ ] Commit with `feat: add criteria confirmation workflow`.

### Task 7: Resume Analysis Guard

**Files:**
- Create: `src/domain/analysis/analysisSchema.ts`
- Create: `src/domain/analysis/analysisService.ts`
- Create: `src/domain/ai/aiProvider.ts`
- Test: `tests/domain/analysisService.test.ts`

- [ ] Add AI provider abstraction.
- [ ] Add structured report schema for candidate summary, recommendation, match level, risk level, capability analysis, risks, interview advice, interview questions, and evidence.
- [ ] Add `analyzeResume` service that requires locked criteria and locked prompt.
- [ ] Ensure `analyzeResume` accepts a RAG provider only for test visibility and never calls it.
- [ ] Add test proving resume analysis does not call RAG.
- [ ] Commit with `feat: add locked resume analysis guard`.

### Task 8: Resume Upload and Parsing

**Files:**
- Create: `src/domain/resumes/resumeParser.ts`
- Create: `src/domain/resumes/resumeService.ts`
- Test: `tests/domain/resumeParser.test.ts`

- [ ] Add normalized plain-text resume parsing.
- [ ] Add PDF and DOCX parser boundary after the pure parser passes.
- [ ] Add upload service shape for original name, MIME type, storage path, and parsed text.
- [ ] Add parser tests.
- [ ] Commit with `feat: add resume parsing boundary`.

### Task 9: Chinese Pages and Server Actions

**Files:**
- Create: `src/app/jobs/page.tsx`
- Create: `src/app/jobs/new/page.tsx`
- Create: `src/app/jobs/[jobId]/standards/page.tsx`
- Create: `src/app/resume-analysis/page.tsx`
- Create: `src/app/candidates/page.tsx`
- Create: `src/app/candidates/[reportId]/page.tsx`
- Create: `src/components/EvidenceList.tsx`
- Create: `src/app/actions/jobs.ts`
- Create: `src/app/actions/standards.ts`
- Create: `src/app/actions/resumes.ts`
- Test: `tests/e2e/navigation.spec.ts`

- [ ] Build Chinese pages for Home, Job Management, Job Standard, Resume Analysis, and Candidate Results.
- [ ] Add forms and empty states matching the MVP workflow.
- [ ] Add server actions for jobs, standards, and resumes.
- [ ] Add Playwright smoke test for Chinese navigation pages.
- [ ] Commit with `feat: add Chinese MVP pages`.

### Task 10: Full Workflow Integration

**Files:**
- Create: `tests/integration/fullWorkflow.test.ts`
- Modify: domain services as needed to expose pure workflow functions.

- [ ] Add mocked workflow test for JD input, RAG snapshot, Prompt Bundle, HR-confirmed criteria, locked prompt, resume analysis, and evidence-based report.
- [ ] Assert RAG is not called during resume analysis.
- [ ] Run `npm test` and `npm run build`.
- [ ] Commit with `test: cover ESSA HR MVP workflow`.

### Task 11: GitHub Publishing

**Repository:** `117488980l-ops/BOSS`

- [ ] Upload each milestone after it passes local checks.
- [ ] Use branch `codex/essa-hr-mvp` for the first code milestone when branch workflow is ready.
- [ ] Open draft PR titled `[codex] build ESSA HR MVP`.
- [ ] PR validation notes must include `npm test`, `npm run build`, and `npm run test:e2e` when available.

## Acceptance Checks

- [ ] HR can create a job with internal and external JD.
- [ ] System can generate a Prompt Bundle using external RAG enhancement.
- [ ] HR can edit and confirm job criteria.
- [ ] System can generate final resume-screening prompt from adjusted criteria.
- [ ] Criteria and prompt can be locked together.
- [ ] Resume can be uploaded and parsed.
- [ ] Resume analysis runs without RAG.
- [ ] Chinese report shows recommendation, match reason, risk points, interview questions, and resume evidence.
- [ ] Report can trace back to locked standard, locked prompt, and pre-analysis RAG snapshot.

## Self-Review Checklist

- Spec coverage: tasks cover scaffold, database schema, RAG boundary, Prompt Bundle, HR criteria workflow, resume parsing, no-RAG analysis, Chinese pages, full workflow test, and GitHub publishing.
- Placeholder scan: no task relies on vague future behavior for required MVP scope.
- Type consistency: `JobCriteria`, `AnalysisReportJson`, `RagProvider`, `AiProvider`, and lock statuses are used consistently across planned tests and services.
