import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Kodraxelsoft | Get a Free Custom Software Quote",
  description:
    "Ready to build your next custom website or AI tool? Contact Kodraxelsoft today. We reply within 24 hours with a clear plan and zero pushy sales talk.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
