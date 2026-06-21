import { EvidenceList } from "@/components/EvidenceList";
import { StatusBadge } from "@/components/StatusBadge";
import type { EvidenceItem } from "@/domain/types";

type CandidateReportPageProps = {
  params: Promise<{ reportId: string }>;
};

const evidence: EvidenceItem[] = [
  {
    criterionId: "must-1",
    source: "resume",
    quote: "负责BOSS直聘渠道，每周筛选300份简历，并协调业务面试",
    explanation: "体现批量简历筛选和面试推进经验。",
    confidence: 0.92
  }
];

export default async function CandidateReportPage({ params }: CandidateReportPageProps) {
  const { reportId } = await params;

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>候选人报告</h1>
          <p>报告编号：{reportId}</p>
        </div>
        <StatusBadge label="推荐面试" tone="success" />
      </div>

      <div className="split-grid">
        <section className="panel">
          <div className="panel__header">
            <div>
              <h2>匹配结论</h2>
              <p>候选人具备招聘专员岗位的核心筛选和沟通经验。</p>
            </div>
          </div>
          <ul className="check-list">
            <li>强匹配：批量简历筛选经验明确</li>
            <li>低风险：简历证据可引用</li>
            <li>待确认：招聘数据分析深度</li>
          </ul>
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <h2>面试建议</h2>
              <p>围绕标准制定、质量控制和数据复盘追问。</p>
            </div>
          </div>
          <ol className="question-list">
            <li>你如何定义一份简历是否进入面试？</li>
            <li>招聘高峰期如何兼顾效率和质量？</li>
            <li>你最常看的招聘漏斗指标是什么？</li>
          </ol>
        </section>
      </div>

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>简历证据</h2>
            <p>所有结论都需要回到简历原文。</p>
          </div>
        </div>
        <EvidenceList items={evidence} />
      </section>
    </section>
  );
}
