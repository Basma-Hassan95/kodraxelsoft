import type { Service } from "@/data/services";

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  "ai-automation-workflow":
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
  "autonomous-ai-agents":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
  "shopify-seo-stores":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200",
  "wordpress-seo-websites":
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1200",
  "custom-web-apps":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  "mobile-app-development":
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
  "ui-ux-product-design":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
  "graphic-brand-identity":
    "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1400",
  "software-maintenance-support":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
};

export function serviceBackgroundImage(service: Service): string {
  if (service.imageUrl?.trim()) return service.imageUrl.trim();
  return (
    DEFAULT_SERVICE_IMAGES[service.slug || service.id] ||
    DEFAULT_SERVICE_IMAGES["custom-web-apps"]
  );
}
