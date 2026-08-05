import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Software & AI Development Services | Kodraxelsoft",
  description:
    "We build fast websites, mobile apps, and smart AI tools for growing businesses. Simple digital solutions that cut manual work and increase sales.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
