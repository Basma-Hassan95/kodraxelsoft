import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Kodraxelsoft | Join Our Team of Senior Builders",
  description:
    "Build simple, high-speed software and smart AI tools with Kodraxelsoft. Remote-first culture, direct mentorship, and great benefits. Apply today.",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
