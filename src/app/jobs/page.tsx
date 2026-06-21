import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

const jobs = [
  {
    id: "demo-job",
    title: "招聘专员",
    department: "人力资源部",
    status: "标准待确认",
    tone: "warning" as const,
    updatedAt: "2026-06-21"
  }
];

export default function JobsPage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>岗位管理</h1>
          <p>从内部JD、外部JD和外部RAG快照生成岗位标准草案。</p>
        </div>
        <Link href="/jobs/new" className="button button--primary">
          新增岗位
        </Link>
      </div>

      <div className="table-panel">
        <div className="table-row table-row--head">
          <span>岗位</span>
          <span>部门</span>
          <span>状态</span>
          <span>更新时间</span>
          <span />
        </div>
        {jobs.map((job) => (
          <div key={job.id} className="table-row">
            <strong>{job.title}</strong>
            <span>{job.department}</span>
            <StatusBadge label={job.status} tone={job.tone} />
            <span>{job.updatedAt}</span>
            <Link href={`/jobs/${job.id}/standards`} className="text-link">
              查看标准
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
