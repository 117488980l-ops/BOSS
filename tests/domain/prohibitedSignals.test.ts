import { describe, expect, it } from "vitest";
import { detectProhibitedSignals, hasProhibitedSignals } from "../../src/domain/security/prohibitedSignals";

describe("prohibited signal detection", () => {
  it("flags protected and unrelated personal attributes", () => {
    const matches = detectProhibitedSignals("女候选人，28岁，已婚，户籍北京，汉族，身份证已核验。");
    const categories = matches.map((match) => match.category);

    expect(categories).toContain("gender");
    expect(categories).toContain("age");
    expect(categories).toContain("marital_status");
    expect(categories).toContain("household_registration");
    expect(categories).toContain("ethnicity");
    expect(categories).toContain("unrelated_identity");
  });

  it("does not flag job-relevant experience statements", () => {
    const text = "拥有5年React和Node.js项目经验，主导过招聘系统和数据看板落地。";

    expect(hasProhibitedSignals(text)).toBe(false);
  });
});
