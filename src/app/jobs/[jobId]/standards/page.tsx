import { confirmAndLockStandard } from "@/app/actions/standards";
import { StatusBadge } from "@/components/StatusBadge";

type StandardsPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function StandardsPage({ params }: StandardsPageProps) {
  const { jobId } = await params;

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>岗位标准确认</h1>
          <p>HR调整后的岗位标准会重新生成最终简历筛选提示词。</p>
        </div>
        <StatusBadge label="待HR确认" tone="warning" />
      </div>

      <form action={confirmAndLockStandard} className="form-panel">
        <input type="hidden" name="jobId" value={jobId} />
        <input type="hidden" name="version" value="1" />

        <label>
          岗位名称
          <input name="title" defaultValue="招聘专员" required />
        </label>

        <label>
          岗位摘要
          <textarea name="summary" rows={4} defaultValue="负责候选人初筛、面试推进和招聘数据沉淀，支持业务团队稳定补充人才。" required />
        </label>

        <div className="form-grid form-grid--two">
          <label>
            硬性要求
            <textarea name="mustHave" rows={6} defaultValue={"简历筛选\n面试推进\n候选人沟通"} required />
          </label>
          <label>
            加分项
            <textarea name="niceToHave" rows={6} defaultValue={"招聘数据分析\nBOSS直聘渠道运营"} />
          </label>
        </div>

        <div className="form-grid form-grid--two">
          <label>
            淘汰项
            <textarea name="dealBreakers" rows={5} defaultValue={"完全没有招聘或人事相关经验\n不能提供简历证据支撑"} />
          </label>
          <label>
            面试关注点
            <textarea name="interviewFocus" rows={5} defaultValue={"过往筛选标准如何制定\n招聘高峰期如何保证质量\n招聘漏斗数据如何使用"} />
          </label>
        </div>

        <label>
          确认人
          <input name="confirmedBy" defaultValue="hr@example.com" />
        </label>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            确认并锁定标准
          </button>
        </div>
      </form>
    </section>
  );
}
