import employees from "@/data/employees.json";
import { differenceInCalendarMonths, parseISO } from "date-fns";
import type { BU } from "./role-context";

export type Employee = {
  id: string;
  name: string;
  gender: string;
  race: string;
  job: string;
  bu: string;
  subBU: string;
  location: string;
  grade: string;
  engaged: string | null;
  terminated: string | null;
  reason: string | null;
};

export const EMPLOYEES = employees as Employee[];

export type Filters = {
  bus: BU[];
  from: Date;
  to: Date;
};

export function computeMetrics(f: Filters) {
  const inBU = EMPLOYEES.filter((e) => f.bus.includes(e.bu as BU));
  const active = inBU.filter((e) => !e.terminated);
  const headcount = 298;

  // exits within date window
  const exitsInRange = inBU.filter((e) => {
    if (!e.terminated) return false;
    const d = parseISO(e.terminated);
    return d >= f.from && d <= f.to;
  });

  const monthsInRange = Math.max(1, differenceInCalendarMonths(f.to, f.from) + 1);
  const annualized = (exitsInRange.length / monthsInRange) * 12;
  const turnoverPct = headcount > 0 ? (annualized / headcount) * 100 : 0;
  const exitRate = headcount > 0 ? (exitsInRange.length / headcount) * 100 : 0;

  // engagement: synthesized per BU (stable mock anchored to data)
  const buEng: Record<string, number> = {
    Operations: 81, Technology: 88, Commercial: 83, Corporate: 85, Support: 80,
  };
  const engagementScore = f.bus.length
    ? Math.round(f.bus.reduce((s, b) => s + (buEng[b] ?? 80), 0) / f.bus.length)
    : 0;

  // composition by grade
  const gradeCounts: Record<string, number> = { Executive: 0, Manager: 0, Professional: 0, Operational: 0 };
  for (const e of active) gradeCounts[e.grade] = (gradeCounts[e.grade] ?? 0) + 1;
  const composition = Object.entries(gradeCounts).map(([name, value]) => ({ name, value }));

  // exits by reason
  const reasonCounts: Record<string, number> = {};
  for (const e of exitsInRange) {
    const r = e.reason ?? "Unknown";
    reasonCounts[r] = (reasonCounts[r] ?? 0) + 1;
  }
  const exitsByReason = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));

  // BU breakdown
  const buBreakdown = (Object.keys(buEng) as BU[])
    .filter((b) => f.bus.includes(b))
    .map((b) => {
      const buEmp = EMPLOYEES.filter((e) => e.bu === b);
      const buActive = buEmp.filter((e) => !e.terminated).length;
      const buExits = buEmp.filter((e) => {
        if (!e.terminated) return false;
        const d = parseISO(e.terminated);
        return d >= f.from && d <= f.to;
      }).length;
      return {
        bu: b,
        headcount: buActive,
        exits: buExits,
        turnover: buActive > 0 ? +((buExits / monthsInRange) * 12 / buActive * 100).toFixed(1) : 0,
        engagement: buEng[b],
      };
    });

  // demographics
  const gender: Record<string, number> = {};
  const race: Record<string, number> = {};
  for (const e of active) {
    gender[e.gender] = (gender[e.gender] ?? 0) + 1;
    race[e.race] = (race[e.race] ?? 0) + 1;
  }

  return {
    headcount,
    exits: exitsInRange.length,
    turnoverPct: +turnoverPct.toFixed(1),
    exitRate: +exitRate.toFixed(1),
    engagementScore,
    monthsInRange,
    composition,
    exitsByReason,
    buBreakdown,
    gender: Object.entries(gender).map(([name, value]) => ({ name, value })),
    race: Object.entries(race).map(([name, value]) => ({ name, value })),
  };
}
