import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Software Engineering Insights & Tech Guides | Kodraxelsoft Blog",
  description:
    "Explore practical tech guides, web development case studies, and AI automation insights written directly by senior software engineers at Kodraxelsoft.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
