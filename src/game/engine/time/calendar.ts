/**
 * In-game time and calendar (Independent Loop 6 / Idea IL6-A).
 *
 * Tracks in-game hours and days. Some events / quests are gated by
 * day-of-week or time-of-day. Affects:
 *
 *   - vendor stock rotation (refreshes daily)
 *   - bounty board refresh (every 2 days)
 *   - rare nocturnal enemies (only spawn between 22:00 and 04:00)
 *   - moon-phase weather (blood moon every 7 days)
 *
 * Time progresses in hours: combat = +1h, rest = +6h, travel = variable.
 */

export interface InGameTime {
  /** Total in-game hours elapsed since campaign start. */
  totalHours: number;
}

export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const BLOOD_MOON_INTERVAL_DAYS = 7;

export type TimeOfDay = "dawn" | "morning" | "noon" | "afternoon" | "dusk" | "night" | "deep_night";

export function timeOfDay(time: InGameTime): TimeOfDay {
  const h = time.totalHours % HOURS_PER_DAY;
  if (h <  5) return "deep_night";
  if (h <  7) return "dawn";
  if (h < 11) return "morning";
  if (h < 13) return "noon";
  if (h < 17) return "afternoon";
  if (h < 19) return "dusk";
  if (h < 22) return "night";
  return "deep_night";
}

export function dayOfWeek(time: InGameTime): number {
  return Math.floor(time.totalHours / HOURS_PER_DAY) % DAYS_PER_WEEK;
}

export function isBloodMoonNight(time: InGameTime): boolean {
  const day = Math.floor(time.totalHours / HOURS_PER_DAY);
  const tod = timeOfDay(time);
  return day % BLOOD_MOON_INTERVAL_DAYS === 0 && (tod === "night" || tod === "deep_night");
}

export function isNocturnalSpawnWindow(time: InGameTime): boolean {
  const h = time.totalHours % HOURS_PER_DAY;
  return h >= 22 || h < 4;
}

export const TIME_COSTS = {
  combat:        1,
  rest:          6,
  short_travel:  2,
  long_travel:  12,
  trial_attempt: 4,
  craft:         1,
  meal_prep:     1,
} as const;

export function advanceTime(time: InGameTime, hours: number): InGameTime {
  return { totalHours: time.totalHours + Math.max(0, hours) };
}

/** Returns true if a vendor stock has refreshed since the last refresh marker. */
export function shouldRefreshVendor(now: InGameTime, lastRefresh: InGameTime): boolean {
  const dNow = Math.floor(now.totalHours / HOURS_PER_DAY);
  const dLast = Math.floor(lastRefresh.totalHours / HOURS_PER_DAY);
  return dNow > dLast;
}

/** Returns true if the bounty board should refresh (every 2 days). */
export function shouldRefreshBounties(now: InGameTime, lastRefresh: InGameTime): boolean {
  const dNow = Math.floor(now.totalHours / HOURS_PER_DAY);
  const dLast = Math.floor(lastRefresh.totalHours / HOURS_PER_DAY);
  return dNow - dLast >= 2;
}
