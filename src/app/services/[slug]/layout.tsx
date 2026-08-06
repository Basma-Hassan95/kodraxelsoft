import type { Metadata } from "next";
import { servicesData } from "@/data/services";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find(
    (s) => (s.slug || s.id) === slug || s.id === slug
  );

  if (!service) {
    return {
      title: "Service | Kodraxelsoft",
      description: "Explore Kodraxelsoft digital services for growing businesses.",
    };
  }

  return {
    title:
      service.metaTitle ||
      `${service.title} | Kodraxelsoft`,
    description: service.metaDescription || service.description,
  };
}

export default function ServiceSlugLayout({ children }: Props) {
  return children;
}
