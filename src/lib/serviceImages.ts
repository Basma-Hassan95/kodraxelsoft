import type { Service } from "@/data/services";

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  "ai-automation-workflow": "/services/ai-automation/hero.png",
  "autonomous-ai-agents": "/services/smart-ai-assistants/hero.png",
  "shopify-seo-stores": "/services/shopify-seo-stores/hero.png",
  "wordpress-seo-websites": "/services/wordpress-seo-websites/hero.png",
  "custom-web-apps": "/services/custom-web-apps/hero.png",
  "mobile-app-development":
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1400",
  "ui-ux-product-design": "/services/ui-ux-product-design/hero.png",
  "graphic-brand-identity":
    "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1400",
  "software-maintenance-support":
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1400",
};

export const DEFAULT_SECONDARY_SERVICE_IMAGES: Record<string, string> = {
  "ai-automation-workflow": "/services/ai-automation/secondary.png",
  "autonomous-ai-agents": "/services/smart-ai-assistants/secondary.png",
  "shopify-seo-stores": "/services/shopify-seo-stores/secondary.png",
  "wordpress-seo-websites": "/services/wordpress-seo-websites/secondary.png",
  "custom-web-apps":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
  "mobile-app-development":
    "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1200",
  "ui-ux-product-design": "/services/ui-ux-product-design/secondary.png",
  "graphic-brand-identity": "/services/graphic-brand-identity/secondary.png",
  "software-maintenance-support": "/services/software-maintenance-support/secondary.png",
};

/** Third visual on the service detail zigzag (solution block) */
export const DEFAULT_DETAIL_SERVICE_IMAGES: Record<string, string> = {
  "ai-automation-workflow": "/services/ai-automation/detail.png",
  "autonomous-ai-agents": "/services/smart-ai-assistants/detail.png",
  "shopify-seo-stores": "/services/shopify-seo-stores/detail.png",
  "wordpress-seo-websites": "/services/wordpress-seo-websites/detail.png",
  "custom-web-apps": "/services/custom-web-apps/detail.png",
  "mobile-app-development": "/services/mobile-app-development/detail.png",
  "ui-ux-product-design": "/services/ui-ux-product-design/detail.png",
  "graphic-brand-identity": "/services/graphic-brand-identity/detail.png",
  "software-maintenance-support": "/services/software-maintenance-support/detail.png",
};

export function serviceBackgroundImage(service: Service): string {
  if (service.imageUrl?.trim()) return service.imageUrl.trim();
  return (
    DEFAULT_SERVICE_IMAGES[service.slug || service.id] ||
    DEFAULT_SERVICE_IMAGES["custom-web-apps"]
  );
}

export function serviceSecondaryImage(service: Service): string {
  return (
    DEFAULT_SECONDARY_SERVICE_IMAGES[service.slug || service.id] ||
    DEFAULT_SECONDARY_SERVICE_IMAGES["custom-web-apps"]
  );
}

export function serviceDetailImage(service: Service): string {
  const key = service.slug || service.id;
  return (
    DEFAULT_DETAIL_SERVICE_IMAGES[key] ||
    serviceSecondaryImage(service)
  );
}
