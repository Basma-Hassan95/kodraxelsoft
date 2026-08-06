import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Kodraxelsoft | Experts in Simple Software & AI Solutions",
  description:
    "Learn how Kodraxelsoft helps growing businesses build fast websites and smart AI tools. No middle agency overhead or technical jargon.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
