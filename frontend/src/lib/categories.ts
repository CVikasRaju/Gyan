import {
  Landmark,
  TrendingUp,
  FlaskConical,
  Cpu,
  Globe,
  HeartPulse,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

/** Canonical categories from the design system (8.2). */
export type CategoryKey =
  | "Politics"
  | "Economy"
  | "Science"
  | "World"
  | "Technology"
  | "Health";

export const CATEGORIES: { name: CategoryKey; icon: LucideIcon }[] = [
  { name: "Politics", icon: Landmark },
  { name: "Economy", icon: TrendingUp },
  { name: "Science", icon: FlaskConical },
  { name: "World", icon: Globe },
  { name: "Technology", icon: Cpu },
  { name: "Health", icon: HeartPulse },
];

/** Slugs used in URLs: /category/politics etc. */
export function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Map any stored category string to a canonical design-system chip class. */
export function categoryChipClass(name?: string | null): string {
  const key = (name || "").toLowerCase();
  if (key.includes("polit")) return "chip-politics";
  if (key.includes("econom") || key.includes("macro")) return "chip-economy";
  if (key.includes("scien")) return "chip-science";
  if (key.includes("world") || key.includes("geopolit") || key.includes("internat"))
    return "chip-world";
  if (key.includes("technology") || key.includes("tech")) return "chip-technology";
  if (key.includes("health")) return "chip-health";
  return "chip-general";
}

/** Icon for a stored category string. */
export function categoryIcon(name?: string | null): LucideIcon {
  const key = (name || "").toLowerCase();
  if (key.includes("polit")) return Landmark;
  if (key.includes("econom") || key.includes("macro")) return TrendingUp;
  if (key.includes("scien")) return FlaskConical;
  if (key.includes("world") || key.includes("geopolit") || key.includes("internat"))
    return Globe;
  if (key.includes("technology")) return Cpu;
  if (key.includes("health")) return HeartPulse;
  return Newspaper;
}

export type QaStatus = "passed" | "flagged" | "quarantined";

export const QA_LABELS: Record<QaStatus, string> = {
  passed: "Verified",
  flagged: "Under Review",
  quarantined: "Quarantined",
};

export function qaBadgeClass(status?: string | null): string {
  if (status === "flagged") return "qa-flagged";
  if (status === "quarantined") return "qa-quarantined";
  return "qa-passed";
}

export function qaLabel(status?: string | null): string {
  if (status === "flagged") return QA_LABELS.flagged;
  if (status === "quarantined") return QA_LABELS.quarantined;
  return QA_LABELS.passed;
}
