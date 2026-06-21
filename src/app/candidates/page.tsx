import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

const reports = [
  {
    id: "report-demo",
    candidate: "李四",
    job: "招聘专员",
    recommendation: "推荐面试",
    match: "强匹配",
    risk: "低风险"
  }
];

export default function CandidatesPage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>候选人结果</h1>
          <p>结果会展示推荐结论、匹配原因、风险点、面试问题和简历证据。</p>
        </div>
      </div>

      <div className="table-panel">
        <div className="table-row table-row--head">
          <span>候选人</span>
          <span>岗位</span>
          <span>结论</span>
          <span>匹配</span>
          <span />
        </div>
        {reports.map((report) => (
          <div key={report.id} className="table-row">
            <strong>{report.candidate}</strong>
            <span>{report.job}</span>
            <StatusBadge label={report.recommendation} tone="success" />
            <span>{report.match}</span>
            <Link href={`/candidates/${report.id}`} className="text-link">
              查看报告
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
