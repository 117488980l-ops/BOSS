import { describe, expect, it } from "vitest";
import type { JobCriteria } from "../../src/domain/types";
import { confirmCriteria, editCriteria, lockCriteria } from "../../src/domain/criteria/criteriaService";

const draftCriteria: JobCriteria = {
  version: 1,
  status: "draft",
  title: "招聘专员",
  summary: "负责招聘初筛和面试推进。",
  mustHave: [],
  niceToHave: [],
  dealBreakers: [],
  interviewFocus: [],
  prohibitedSignals: ["age", "gender"]
};

describe("criteria workflow", () => {
  it("requires HR confirmation before locking criteria", () => {
    expect(() => lockCriteria(draftCriteria)).toThrow("HR确认岗位标准后才能锁定");

    const confirmed = confirmCriteria(draftCriteria, "hr@example.com");
    const locked = lockCriteria(confirmed);

    expect(confirmed.status).toBe("confirmed");
    expect(locked.status).toBe("locked");
    expect(locked.lockedAt).toEqual(expect.any(String));
  });

  it("blocks direct editing after criteria are locked", () => {
    const locked = lockCriteria(confirmCriteria(draftCriteria, "hr@example.com"));

    expect(() => editCriteria(locked, { summary: "新摘要" })).toThrow("已锁定的岗位标准不能直接编辑");
  });
});
