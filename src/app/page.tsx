import { StatusBadge } from "@/components/StatusBadge";

const metrics = [
  { label: "岗位数量", value: "0" },
  { label: "简历分析数量", value: "0" },
  { label: "已锁定标准", value: "0" }
];

export default function HomePage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>首页</h1>
          <p>围绕岗位标准、简历证据和面试建议的 HR 辅助工作台。</p>
        </div>
        <StatusBadge label="系统初始化" />
      </div>

      <div className="metric-grid" aria-label="系统指标">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-card__label">{metric.label}</div>
            <div className="metric-card__value">{metric.value}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
