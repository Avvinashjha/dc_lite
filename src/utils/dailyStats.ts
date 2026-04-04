export interface DailyProgressRow {
  solved?: boolean;
  solvedAt?: number | null;
  attempts?: number;
  attemptsByDay?: Record<string, number>;
  solutionUnlockedAt?: number | null;
  solutionUnlockPenaltyApplied?: boolean;
}

export interface DailyProblemLite {
  slug: string;
  title: string;
  publishedAt?: string;
  topic?: string;
}

export interface DailyStatsSummary {
  currentStreak: number;
  longestStreak: number;
  solvedToday: boolean;
  totalSolved: number;
  totalAttempts: number;
  activeDays: number;
  solveRate: number;
  consistencyPoints: number;
}

function toDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeDayKey(value?: string): string | null {
  if (!value) return null;
  const key = value.trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : null;
}

export function buildDailyStats(
  problems: DailyProblemLite[],
  progressMap: Record<string, DailyProgressRow>,
  now = new Date()
): DailyStatsSummary {
  const todayKey = toDayKey(now);
  const solvedDaySet = new Set<string>();
  let totalSolved = 0;
  let totalAttempts = 0;
  const activityByDay: Record<string, number> = {};
  let consistencyPoints = 0;
  let solvedToday = false;

  for (const problem of problems) {
    const row = progressMap[problem.slug] || {};
    totalAttempts += Number(row.attempts || 0);
    const attemptsByDay = row.attemptsByDay || {};
    for (const day of Object.keys(attemptsByDay)) {
      activityByDay[day] = Number(activityByDay[day] || 0) + Number(attemptsByDay[day] || 0);
    }

    if (row.solutionUnlockedAt && row.solutionUnlockPenaltyApplied) {
      consistencyPoints -= 0.5;
    }

    if (!row.solved) continue;
    totalSolved += 1;
    const publishDay = normalizeDayKey(problem.publishedAt);
    const solvedDay = row.solvedAt ? toDayKey(new Date(row.solvedAt)) : null;
    if (!publishDay || !solvedDay) continue;
    if (publishDay > todayKey) continue;
    if (publishDay === solvedDay) {
      consistencyPoints += 1;
      solvedDaySet.add(publishDay);
      if (publishDay === todayKey) solvedToday = true;
    } else if (solvedDay > publishDay) {
      consistencyPoints += 0.5;
    }
  }

  let currentStreak = 0;
  const cursor = new Date(now);
  while (true) {
    const key = toDayKey(cursor);
    if (!solvedDaySet.has(key)) break;
    currentStreak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  const solvedDays = Array.from(solvedDaySet).sort();
  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of solvedDays) {
    if (!prev) {
      run = 1;
    } else {
      const prevDate = new Date(`${prev}T00:00:00.000Z`);
      prevDate.setUTCDate(prevDate.getUTCDate() + 1);
      run = toDayKey(prevDate) === day ? run + 1 : 1;
    }
    if (run > longestStreak) longestStreak = run;
    prev = day;
  }

  const activeDays = Object.keys(activityByDay).filter((d) => Number(activityByDay[d]) > 0).length;
  return {
    currentStreak,
    longestStreak,
    solvedToday,
    totalSolved,
    totalAttempts,
    activeDays,
    solveRate: problems.length ? Math.round((totalSolved / problems.length) * 100) : 0,
    consistencyPoints: Math.round(Math.max(0, consistencyPoints) * 10) / 10,
  };
}
