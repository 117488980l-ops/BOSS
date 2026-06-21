import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";

const metrics = [
  { label: "岗位数量", value: "0" },
  { label: "简历分析数量", value: "0" },
  { label: "已锁定标准", value: "0" }
];

const workflow = [
  "填写内部/外部JD",
  "外部RAG增强提示词",
  "生成岗位标准与筛选提示词",
  "HR确认并锁定标准",
  "上传简历并分析",
  "输出候选人结果"
];

export default function HomePage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>ESSA HR 工作台</h1>
          <p>围绕岗位标准、简历证据和面试建议的 HR 辅助工作台。</p>
        </div>
        <StatusBadge label="MVP 搭建中" tone="warning" />
      </div>

      <div className="metric-grid" aria-label="系统指标">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-card__label">{metric.label}</div>
            <div className="metric-card__value">{metric.value}</div>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>流程总览</h2>
            <p>RAG 仅进入JD和提示词准备阶段，简历分析只使用锁定标准、锁定提示词和简历文本。</p>
          </div>
          <Link href="/jobs/new" className="button button--primary">
            新增岗位
          </Link>
        </div>
        <ol className="workflow-list">
          {workflow.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
