import HomePageClient from "./HomePageClient";
import { loadPublicHeroSlides } from "@/lib/heroCms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const initialHeroSlides = await loadPublicHeroSlides();
  return <HomePageClient initialHeroSlides={initialHeroSlides} />;
}
