import { describe, expect, it } from "vitest";
import { normalizeResumeText, parsePlainTextResume } from "../../src/domain/resumes/resumeParser";

describe("resume parser", () => {
  it("normalizes whitespace and keeps useful resume text", () => {
    const text = normalizeResumeText(" 张三\r\n\r\n\r\n负责  招聘系统\t项目 ");

    expect(text).toBe("张三\n\n负责 招聘系统 项目");
  });

  it("parses plain text resumes into normalized text", () => {
    const parsed = parsePlainTextResume("resume.txt", " 候选人负责每日筛选80份简历 ");

    expect(parsed.originalName).toBe("resume.txt");
    expect(parsed.text).toBe("候选人负责每日筛选80份简历");
  });
});
