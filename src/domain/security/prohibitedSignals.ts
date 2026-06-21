import type { ProhibitedSignalCategory } from "../types";

export interface ProhibitedSignalMatch {
  category: ProhibitedSignalCategory;
  label: string;
  matchedText: string;
  index: number;
}

const prohibitedPatterns: Array<{
  category: ProhibitedSignalCategory;
  label: string;
  patterns: RegExp[];
}> = [
  { category: "age", label: "年龄", patterns: [/年龄/g, /年纪/g, /\d{2}\s*岁/g, /出生年月/g, /出生日期/g] },
  { category: "gender", label: "性别", patterns: [/性别/g, /男士/g, /女士/g, /男性/g, /女性/g, /女候选人/g, /男候选人/g] },
  { category: "marital_status", label: "婚姻状况", patterns: [/婚育/g, /已婚/g, /未婚/g, /离异/g, /配偶/g] },
  { category: "fertility_status", label: "生育状况", patterns: [/生育/g, /备孕/g, /怀孕/g, /孕期/g] },
  { category: "ethnicity", label: "民族", patterns: [/民族/g, /汉族/g, /回族/g, /满族/g, /少数民族/g] },
  { category: "birthplace", label: "出生地", patterns: [/籍贯/g, /出生地/g, /老家/g] },
  { category: "household_registration", label: "户籍", patterns: [/户籍/g, /户口/g, /本地户口/g] },
  { category: "unrelated_identity", label: "无关身份信息", patterns: [/身份证/g, /身高/g, /体重/g, /照片/g, /政治面貌/g, /星座/g, /血型/g] }
];

export function detectProhibitedSignals(text: string): ProhibitedSignalMatch[] {
  const matches: ProhibitedSignalMatch[] = [];

  for (const item of prohibitedPatterns) {
    for (const pattern of item.patterns) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        if (match.index === undefined || !match[0]) continue;
        matches.push({
          category: item.category,
          label: item.label,
          matchedText: match[0],
          index: match.index
        });
      }
    }
  }

  return matches.sort((a, b) => a.index - b.index);
}

export function hasProhibitedSignals(text: string): boolean {
  return detectProhibitedSignals(text).length > 0;
}

export function summarizeProhibitedSignals(text: string): string[] {
  const seen = new Set<string>();
  return detectProhibitedSignals(text)
    .filter((match) => {
      const key = `${match.category}:${match.matchedText}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((match) => `${match.label}: ${match.matchedText}`);
}
