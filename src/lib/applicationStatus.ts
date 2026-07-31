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
  new: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/35",
  reviewing:
    "bg-[#004d4d]/10 text-[#004d4d] dark:bg-cyan-500/10 dark:text-cyan-300 border-[#004d4d]/30 dark:border-cyan-500/30",
  interview: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/35",
  hired: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/35",
  rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/35",
};

export function applicationStatusClass(status: string | null | undefined): string {
  const key = String(status || "new").toLowerCase() as ApplicationStatus;
  return STATUS_STYLES[key] || STATUS_STYLES.new;
}
