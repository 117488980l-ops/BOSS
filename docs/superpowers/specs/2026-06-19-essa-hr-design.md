# ESSA HR Resume Screening System Design

## Product Goal

ESSA HR helps HR decide whether a candidate should be invited to the next interview round. The system outputs the match rationale, risk points, interview suggestions, interview questions, and resume evidence behind each conclusion.

The product is a decision-support system. It does not replace HR judgment and does not make unsupported subjective conclusions.

## Core Principles

1. Standards first: the system must create and lock a job standard before any resume can be analyzed.
2. Evidence driven: every candidate conclusion must cite resume evidence.
3. No ad hoc judgment: resume analysis can only use the locked job standard, locked screening prompt, and resume content.
4. RAG is limited to the JD and prompt-preparation stage: external RAG is used to enhance the prompt context before job standards and screening prompts are generated. Resume analysis must not call RAG.
5. Versioned decisions: locked standards, prompts, RAG snapshots, and analysis reports must be traceable.

## MVP Scope

The first release must deliver one complete HR workflow:

1. HR creates a job.
2. HR fills internal JD, external JD, required skills, preferred skills, department, and hiring goal.
3. The system calls an external RAG adapter to retrieve job-related knowledge.
4. The system creates a Prompt Bundle containing the RAG snapshot, job-standard generation prompt, and resume-screening prompt template.
5. The system generates a draft job standard.
6. HR reviews and edits the job standard.
7. The system regenerates or updates the final resume-screening prompt from the HR-adjusted job standard.
8. HR locks the job standard and final screening prompt version.
9. HR uploads a resume.
10. The system parses resume text.
11. The system analyzes the resume without calling RAG.
12. The system outputs candidate evaluation, match reasons, risks, interview advice, interview questions, and resume evidence.

Out of scope for MVP:

- Multi-tenant enterprise administration.
- Full ATS workflow management.
- Automatic candidate rejection.
- OCR for scanned resumes.
- Self-hosted vector database.
- Calendar, email, or interview scheduling integrations.

## Recommended Architecture

Use a single web application for MVP:

- Frontend and backend: Next.js with TypeScript.
- Database: PostgreSQL with Prisma.
- AI calls: server-side service modules returning structured JSON.
- Resume parsing: server-side PDF and DOCX text extraction.
- External RAG: adapter interface with replaceable provider implementations.
- Deployment: local Docker first, then server deployment.

The system should keep domain logic in small service modules:

- Job service: owns job creation and editing.
- RAG service: owns external knowledge retrieval and snapshots.
- Prompt Bundle service: owns prompt generation, prompt updates, and locking.
- Criteria service: owns job standards and standard versions.
- Resume service: owns file upload and text extraction.
- Analysis service: owns resume analysis using locked assets only.
- Evidence service: owns evidence normalization and display.

## Main Workflow

```text
Internal JD + external JD
-> External RAG retrieval
-> RAG snapshot
-> Prompt Bundle generation
-> Draft job standard generation
-> HR edits job standard
-> Final screening prompt generation from adjusted standard
-> Lock job standard and prompt version
-> Upload resume
-> Parse resume text
-> Analyze resume without RAG
-> Output result with resume evidence
```

## RAG Workflow

RAG is used only before resume analysis. It enriches the prompt-building stage by retrieving relevant external knowledge from an existing external knowledge base.

Allowed RAG usage:

- Enhancing job-standard generation prompts.
- Enhancing resume-screening prompt templates.
- Providing industry capability models.
- Providing role-specific screening dimensions.
- Providing interview focus suggestions.
- Providing company or domain knowledge that helps define standards.

Forbidden RAG usage:

- Calling RAG during resume analysis.
- Using RAG as candidate evidence.
- Using RAG to infer facts not present in the resume.
- Re-querying RAG after a standard and prompt are locked for a candidate analysis.

The first implementation must include a `RagProvider` interface and an `EmptyRagProvider` or mock provider so the MVP can run even when the external service is unavailable.

## Prompt Bundle

A Prompt Bundle is a versioned asset created from job information and RAG context. It is the bridge between JD preparation, job standards, and resume screening.

Each Prompt Bundle stores:

- Job ID.
- RAG query input.
- RAG retrieval result snapshot.
- Job-standard generation prompt.
- Resume-screening prompt template.
- HR-adjusted job standard snapshot.
- Final resume-screening prompt.
- Version number.
- Status: draft or locked.
- Locked timestamp.

Rules:

- A draft Prompt Bundle can be regenerated.
- A locked Prompt Bundle cannot be edited.
- If HR changes the job standard after locking, the system must create a new version.
- Resume analysis must reference one locked Prompt Bundle.

## Job Standard Workflow

Job standards are generated from the Prompt Bundle and then reviewed by HR.

Standard fields:

- Capability model.
- Capability weights.
- Must-have requirements.
- Preferred requirements.
- Elimination rules.
- Risk signals.
- Interview focus areas.

Workflow:

```text
Generated draft
-> HR edits
-> HR confirms
-> final screening prompt updates
-> standard and prompt lock together
```

The HR-adjusted standard is the source of truth for resume screening. The original AI-generated draft is useful for audit but does not control analysis after HR edits it.

## Resume Analysis Workflow

Resume analysis starts only after the selected job has a locked standard and locked final screening prompt.

Inputs:

- Locked job standard.
- Locked final resume-screening prompt.
- Parsed resume text.

The analysis service must not call RAG. It must output structured JSON:

- Candidate summary.
- Interview recommendation.
- Match level: strong, medium, or weak.
- Capability match analysis.
- Risk points.
- Interview advice.
- Interview questions.
- Evidence list mapping conclusions to resume text.

Every conclusion must include evidence from the resume. If the resume does not provide enough information, the system must mark the point as uncertain and recommend an interview confirmation question.

## Pages

All user-facing pages are in Chinese.

1. Home
   - System status.
   - Job count.
   - Resume analysis count.
   - Recent activity.

2. Job Management
   - Create job.
   - Edit job draft.
   - View job list.
   - Fields: title, department, internal JD, external JD, required skills, preferred skills, hiring goal.

3. Job Standard
   - Generate Prompt Bundle.
   - View RAG snapshot.
   - View and edit generated standard.
   - Generate final screening prompt from HR-adjusted standard.
   - Lock standard and prompt version.

4. Resume Analysis
   - Select job and locked standard version.
   - Upload resume.
   - View parsed resume text.
   - Run analysis.

5. Candidate Results
   - Candidate list.
   - Interview recommendation.
   - Match level.
   - Risk level.
   - Detailed report.
   - Evidence display.

## Data Model

Minimum tables:

- `jobs`: job base information.
- `rag_retrieval_logs`: external RAG requests and returned snapshots.
- `prompt_bundles`: prompt assets, versions, and lock status.
- `job_criteria_versions`: HR-confirmed job standards.
- `resumes`: uploaded file metadata and parsed text.
- `candidates`: candidate metadata extracted from resumes.
- `analysis_reports`: final structured analysis output.
- `analysis_evidence`: evidence items linked to report conclusions.

Key relationships:

- A job has many Prompt Bundles.
- A job has many criteria versions.
- A locked criteria version belongs to a locked Prompt Bundle.
- A resume analysis report references one candidate, one resume, one locked criteria version, and one locked Prompt Bundle.
- Evidence belongs to one analysis report.

## API Boundaries

Initial server-side capabilities:

- `createJob(input)`: creates a job draft.
- `updateJob(jobId, input)`: updates editable job fields.
- `retrieveKnowledge(input)`: calls the external RAG provider and stores a snapshot.
- `createPromptBundle(jobId)`: creates prompts from job data and RAG snapshot.
- `generateJobCriteria(promptBundleId)`: creates a draft standard.
- `updateJobCriteria(criteriaVersionId, input)`: stores HR edits.
- `finalizeScreeningPrompt(criteriaVersionId)`: creates the final resume-screening prompt from HR-adjusted standard.
- `lockCriteriaAndPrompt(criteriaVersionId, promptBundleId)`: locks both assets.
- `uploadResume(input)`: stores resume file and metadata.
- `parseResume(resumeId)`: extracts text.
- `analyzeResume(resumeId, criteriaVersionId, promptBundleId)`: analyzes resume without RAG.
- `getAnalysisReport(reportId)`: returns structured report and evidence.

## Error Handling

- If RAG fails during Prompt Bundle generation, the user can retry or continue with an empty RAG snapshot.
- If no locked standard exists, resume analysis is blocked.
- If the final screening prompt is not locked, resume analysis is blocked.
- If resume parsing fails, the user sees a clear parsing failure and can upload another file.
- If AI output is invalid JSON, the system retries once with a repair prompt and then shows a controlled failure.
- If a conclusion lacks resume evidence, the analysis is marked incomplete and the point is converted to an interview confirmation question.

## Testing Strategy

MVP verification uses focused tests:

- Unit tests for RAG provider behavior and fallback.
- Unit tests for Prompt Bundle state transitions.
- Unit tests that block resume analysis without locked criteria and prompt.
- Unit tests confirming resume analysis does not call RAG.
- Integration test for the full workflow from job creation to report output using mocked AI and mocked RAG.
- UI smoke test for the five Chinese pages.

## Privacy and Compliance

- Candidate resumes are sensitive data.
- The system must not make decisions based on protected or irrelevant personal attributes.
- The first version must avoid using age, gender, marital status, fertility status, ethnicity, birthplace, or unrelated personal identity data as screening factors.
- Reports should phrase recommendations as HR decision support, not automatic rejection.

## GitHub Workflow

Repository: `117488980l-ops/BOSS`.

Development should proceed in small uploaded milestones:

1. Design document.
2. Implementation plan.
3. Project scaffold.
4. Database schema.
5. Job management.
6. RAG adapter and Prompt Bundle.
7. Criteria editing and locking.
8. Resume upload and parsing.
9. Resume analysis.
10. Candidate result pages.

Each milestone should be committed or uploaded with a clear message. When the repository has a usable branch workflow, larger code milestones should use draft pull requests.

## Acceptance Criteria

The MVP is complete when HR can:

1. Create a job with internal and external JD.
2. Generate a Prompt Bundle using external RAG enhancement.
3. Generate a draft job standard.
4. Edit and confirm the job standard.
5. Generate the final resume-screening prompt from the adjusted standard.
6. Lock the standard and prompt version.
7. Upload a resume.
8. Run analysis without RAG.
9. View a Chinese report with recommendation, match reason, risk points, interview questions, and resume evidence.
10. Trace the report back to the locked standard, locked prompt, and RAG snapshot used before analysis.
