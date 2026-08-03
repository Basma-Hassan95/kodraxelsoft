/** Application status colors aligned with Kodraxelsoft brand (teal/cyan). */
export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "interview",
  "hired",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40",
  reviewing:
    "bg-[#004d4d]/12 text-[#004d4d] dark:bg-cyan-500/15 dark:text-cyan-300 border-[#004d4d]/35 dark:border-cyan-500/35",
  interview:
    "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40",
  hired:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40",
  rejected:
    "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40",
};

export function applicationStatusClass(status: string | null | undefined): string {
  const key = String(status || "new").toLowerCase() as ApplicationStatus;
  return STATUS_STYLES[key] || STATUS_STYLES.new;
}
