import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";

export type ChatSuggestion = { id: string; label: string };

const FALLBACK_SUGGESTIONS: ChatSuggestion[] = [
  { id: "projects", label: "Show me your best portfolio projects" },
  { id: "services", label: "What services does Kodraxelsoft offer?" },
  { id: "pricing", label: "How does pricing work?" },
  { id: "hire", label: "How can I start a project with you?" },
  { id: "ai", label: "Do you build AI and automation solutions?" },
  { id: "contact", label: "How can I contact Kodraxelsoft?" },
];

/** Build clickable, portfolio-related chat suggestions (English default). */
export function buildChatSuggestions(
  projects: Project[],
  services: Service[]
): ChatSuggestion[] {
  const suggestions: ChatSuggestion[] = [];

  const featured = projects.filter((p) => p.featured).slice(0, 2);
  for (const p of featured) {
    const short = p.title.split(" - ")[0]?.trim() || p.title;
    suggestions.push({
      id: `project-${p.id}`,
      label: `Tell me about ${short}`,
    });
  }

  for (const s of services.slice(0, 2)) {
    suggestions.push({
      id: `service-${s.id}`,
      label: `What is included in ${s.title}?`,
    });
  }

  suggestions.push(
    { id: "all-projects", label: "Show me your best portfolio projects" },
    { id: "pricing", label: "How does pricing work?" },
    { id: "hire", label: "How can I start a project with you?" },
    { id: "contact", label: "How can I contact Kodraxelsoft?" }
  );

  const seen = new Set<string>();
  const unique = suggestions.filter((s) => {
    const key = s.label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, 6).length ? unique.slice(0, 6) : FALLBACK_SUGGESTIONS;
}
