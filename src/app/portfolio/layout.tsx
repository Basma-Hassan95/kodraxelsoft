import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio & Case Studies | Real Results by Kodraxelsoft",
  description:
    "Explore custom websites, fast web apps, and smart AI tools built by Kodraxelsoft. See how we help businesses increase sales and save hours of work.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
