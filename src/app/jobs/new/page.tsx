import { prepareJobPromptBundle } from "@/app/actions/jobs";

export default function NewJobPage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>新增岗位</h1>
          <p>提交后会生成 Prompt Bundle：岗位标准提示词和简历筛选提示词模板。</p>
        </div>
      </div>

      <form action={prepareJobPromptBundle} className="form-panel">
        <div className="form-grid form-grid--two">
          <label>
            岗位名称
            <input name="title" placeholder="例如：招聘专员" required />
          </label>
          <label>
            部门
            <input name="department" placeholder="例如：人力资源部" />
          </label>
        </div>

        <label>
          内部JD
          <textarea name="internalJd" rows={7} placeholder="粘贴内部岗位职责、团队背景和业务目标" required />
        </label>

        <label>
          外部JD
          <textarea name="externalJd" rows={7} placeholder="粘贴外部招聘平台JD或竞品岗位JD" required />
        </label>

        <div className="form-grid form-grid--two">
          <label>
            必须技能
            <textarea name="requiredSkills" rows={5} placeholder="每行一个：简历筛选、结构化面试" />
          </label>
          <label>
            加分技能
            <textarea name="preferredSkills" rows={5} placeholder="每行一个：招聘数据分析、渠道运营" />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            生成提示词
          </button>
        </div>
      </form>
    </section>
  );
}
