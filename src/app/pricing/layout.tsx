import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparent Software Pricing Plans | Kodraxelsoft",
  description:
    "Clear, fixed-price software development plans with zero hidden fees. Choose a plan or request a custom quote tailored to your business growth.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
