import type { EvidenceItem } from "@/domain/types";

export function EvidenceList({ items }: { items: EvidenceItem[] }) {
  if (!items.length) {
    return <p className="muted">暂无可展示证据。</p>;
  }

  return (
    <div className="evidence-list">
      {items.map((item, index) => (
        <article key={`${item.criterionId ?? "evidence"}-${index}`} className="evidence-item">
          <div className="evidence-item__meta">
            <span>简历证据</span>
            <span>{Math.round(item.confidence * 100)}%</span>
          </div>
          <blockquote>{item.quote}</blockquote>
          <p>{item.explanation}</p>
        </article>
      ))}
    </div>
  );
}
