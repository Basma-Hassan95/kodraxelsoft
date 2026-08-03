/** Shared project-brief options for contact / home inquiry forms */

export const DESIGN_OPTIONS = [
  { id: "need_design", label: "No, I need Kodraxelsoft to design it" },
  { id: "have_design", label: "Yes, I have Figma / design files ready" },
  { id: "partial", label: "Partial — I have references / wireframes" },
] as const;

export const DOMAIN_HOSTING_OPTIONS = [
  { id: "need_setup", label: "I need Kodraxelsoft to configure & purchase" },
  { id: "have_domain", label: "I already have domain & hosting" },
  { id: "undecided", label: "Not sure yet — advise me" },
] as const;

export const INTEGRATION_OPTIONS = [
  { id: "standard", label: "No, standard setup is fine" },
  { id: "custom_db", label: "Yes — custom database needed" },
  { id: "apis", label: "Yes — third-party APIs / integrations" },
  { id: "both", label: "Both custom DB and API integrations" },
] as const;

export const AESTHETIC_OPTIONS = [
  { id: "dark_glass", label: "Dark Mode & Glassmorphic (Modern)" },
  { id: "clean_light", label: "Clean Light & Minimal" },
  { id: "corporate", label: "Corporate / Professional" },
  { id: "bold_brand", label: "Bold Brand Colors & High Contrast" },
  { id: "custom", label: "Custom — I'll share references" },
] as const;

export const TIMELINE_OPTIONS = [
  { id: "asap", label: "ASAP / Rush (2–4 weeks)" },
  { id: "standard", label: "Standard (1–2 months)" },
  { id: "flexible", label: "Flexible (2–3 months)" },
  { id: "explore", label: "Just exploring for now" },
] as const;

export type DesignOptionId = (typeof DESIGN_OPTIONS)[number]["id"];
export type DomainOptionId = (typeof DOMAIN_HOSTING_OPTIONS)[number]["id"];
export type IntegrationOptionId = (typeof INTEGRATION_OPTIONS)[number]["id"];
export type AestheticOptionId = (typeof AESTHETIC_OPTIONS)[number]["id"];
export type TimelineOptionId = (typeof TIMELINE_OPTIONS)[number]["id"];

export type ProjectBriefAnswers = {
  designReady: DesignOptionId;
  domainHosting: DomainOptionId;
  integrations: IntegrationOptionId;
  aesthetic: AestheticOptionId;
  timeline: TimelineOptionId;
  additionalSpecs: string;
  referenceWebsite: string;
};

export const DEFAULT_PROJECT_BRIEF: ProjectBriefAnswers = {
  designReady: "need_design",
  domainHosting: "need_setup",
  integrations: "standard",
  aesthetic: "dark_glass",
  timeline: "standard",
  additionalSpecs: "",
  referenceWebsite: "",
};

export function labelOf<T extends { id: string; label: string }>(
  options: readonly T[],
  id: string
) {
  return options.find((o) => o.id === id)?.label || id;
}

export function formatProjectBriefDetails(brief: ProjectBriefAnswers): string {
  return [
    `1. Design ready: ${labelOf(DESIGN_OPTIONS, brief.designReady)}`,
    `2. Domain & hosting: ${labelOf(DOMAIN_HOSTING_OPTIONS, brief.domainHosting)}`,
    `3. Database / APIs: ${labelOf(INTEGRATION_OPTIONS, brief.integrations)}`,
    `4. Aesthetic style: ${labelOf(AESTHETIC_OPTIONS, brief.aesthetic)}`,
    `5. Launch timeline: ${labelOf(TIMELINE_OPTIONS, brief.timeline)}`,
    brief.referenceWebsite.trim()
      ? `Reference website: ${brief.referenceWebsite.trim()}`
      : null,
    brief.additionalSpecs.trim()
      ? `6. Additional specs: ${brief.additionalSpecs.trim()}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}
