import type { JobCriteria } from "../types";

export function confirmCriteria(criteria: JobCriteria, confirmedBy: string): JobCriteria {
  if (criteria.status === "locked") {
    throw new Error("已锁定的岗位标准不能重新确认");
  }

  return {
    ...criteria,
    status: "confirmed",
    confirmedBy,
    confirmedAt: new Date().toISOString()
  };
}

export function editCriteria(criteria: JobCriteria, patch: Partial<Omit<JobCriteria, "status" | "version">>): JobCriteria {
  if (criteria.status === "locked") {
    throw new Error("已锁定的岗位标准不能直接编辑，请创建新版本");
  }

  return {
    ...criteria,
    ...patch,
    status: "draft"
  };
}

export function lockCriteria(criteria: JobCriteria): JobCriteria {
  if (criteria.status !== "confirmed") {
    throw new Error("HR确认岗位标准后才能锁定");
  }

  return {
    ...criteria,
    status: "locked",
    lockedAt: new Date().toISOString()
  };
}

export function createNextCriteriaVersion(criteria: JobCriteria): JobCriteria {
  return {
    ...criteria,
    version: criteria.version + 1,
    status: "draft",
    confirmedAt: undefined,
    confirmedBy: undefined,
    lockedAt: undefined
  };
}
