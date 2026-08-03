import type { Service } from "@/data/services";

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  "web-architecture":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  "ai-integration":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
  "cloud-infrastructure":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
  "mobile-enterprise":
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
  "ai-automation":
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
  wordpress:
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
  "custom-software":
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
};

export function serviceBackgroundImage(service: Service): string {
  if (service.imageUrl?.trim()) return service.imageUrl.trim();
  return (
    DEFAULT_SERVICE_IMAGES[service.slug || service.id] ||
    DEFAULT_SERVICE_IMAGES["web-architecture"]
  );
}
