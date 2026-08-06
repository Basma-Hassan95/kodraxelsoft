import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Simple 6-Step Software Development Process | Kodraxelsoft",
  description:
    "Discover how Kodraxelsoft takes your project from initial idea to live launch in 6 clear, stress-free stages. Guaranteed timelines and zero technical speak.",
};

export default function ProcessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
