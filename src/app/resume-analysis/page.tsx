import { analyzeResumeAction } from "@/app/actions/resumes";
import { StatusBadge } from "@/components/StatusBadge";

export default function ResumeAnalysisPage() {
  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>简历分析</h1>
          <p>分析阶段不会调用RAG，只使用锁定岗位标准、锁定筛选提示词和简历文本。</p>
        </div>
        <StatusBadge label="RAG禁用" tone="success" />
      </div>

      <form action={analyzeResumeAction} className="form-panel">
        <div className="form-grid form-grid--two">
          <label>
            岗位
            <select name="jobId" defaultValue="demo-job">
              <option value="demo-job">招聘专员</option>
            </select>
          </label>
          <label>
            简历文件
            <input name="resumeFile" type="file" accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
          </label>
        </div>

        <label>
          简历文本
          <textarea name="resumeText" rows={12} placeholder="也可以直接粘贴简历文本" />
        </label>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            开始分析
          </button>
        </div>
      </form>
    </section>
  );
}
