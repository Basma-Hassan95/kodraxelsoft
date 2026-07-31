"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { servicesData, Service } from "@/data/services";
import { projectsData, Project } from "@/data/projects";
import { blogPosts, BlogPost } from "@/data/blog";
import type {
  LeadInquiry,
  CareerPosition,
  TestimonialItem,
  MediaAsset,
  SiteSettings,
} from "@/types/admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";
import {
  apiCreate,
  apiDelete,
  apiList,
  apiPatch,
  apiUpdate,
  apiUploadMedia,
  isUuid,
  pingCmsApi,
} from "@/lib/cmsApi";
import {
  serviceFromApi,
  serviceToApi,
  projectFromApi,
  projectToApi,
  blogFromApi,
  blogToApi,
  leadFromOrder,
  leadStatusToApi,
  careerFromApi,
  careerToApi,
  testimonialFromApi,
  testimonialToApi,
  mediaFromApi,
  settingsFromApi,
  settingsToApi,
} from "@/lib/cmsMappers";

export type {
  LeadInquiry,
  CareerPosition,
  TestimonialItem,
  MediaAsset,
  SiteSettings,
} from "@/types/admin";

interface AdminDataContextType {
  loading: boolean;
  apiConnected: boolean;
  refreshAll: () => Promise<void>;
  refreshLeads: () => Promise<void>;

  services: Service[];
  projects: Project[];
  blogPosts: BlogPost[];
  leads: LeadInquiry[];
  careers: CareerPosition[];
  testimonials: TestimonialItem[];
  mediaAssets: MediaAsset[];
  settings: SiteSettings;

  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addBlogPost: (post: BlogPost) => Promise<void>;
  updateBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  updateLeadStatus: (id: string, status: LeadInquiry["status"]) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  addCareer: (career: CareerPosition) => Promise<void>;
  updateCareer: (career: CareerPosition) => Promise<void>;
  deleteCareer: (id: string) => Promise<void>;

  addTestimonial: (item: TestimonialItem) => Promise<void>;
  updateTestimonial: (item: TestimonialItem) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  moderateTestimonial: (id: string, approve: boolean) => Promise<void>;

  addMediaAsset: (asset: MediaAsset) => Promise<void | MediaAsset>;
  uploadMediaFile: (file: File) => Promise<MediaAsset>;
  deleteMediaAsset: (id: string) => Promise<void>;

  updateSettings: (newSettings: SiteSettings) => Promise<void>;
}

const defaultLeads: LeadInquiry[] = [];

const defaultCareers: CareerPosition[] = [
  {
    id: "role-1",
    title: "Senior Principal Next.js Architect",
    department: "Frontend Engineering",
    type: "Full-Time",
    location: "San Francisco, CA / Remote",
    salary: "$180,000 - $240,000",
    description:
      "Lead the architecture of sub-50ms Next.js 16 App Router platforms with WebGL and GSAP motion.",
    requirements: [
      "7+ years React/Next.js experience",
      "Deep TypeScript & WebGL mastery",
      "Track record of high-scale apps",
    ],
    active: true,
  },
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    clientName: "Marcus Thorne",
    role: "VP of Engineering",
    company: "Velox Global Capital",
    review:
      "Kodraxelsoft engineered our high-frequency trading portal in 5 weeks. UI rendering latency dropped by 85%.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
];

const defaultSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };

const AdminDataContext = createContext<AdminDataContextType | undefined>(
  undefined
);

async function safeList<T>(
  path: string,
  map: (row: Record<string, unknown>) => T,
  auth = true,
  query: Record<string, string | number | boolean | undefined> = {}
): Promise<T[] | null> {
  try {
    const { data } = await apiList<Record<string, unknown>>(
      path,
      { limit: 100, ...query },
      auth
    );
    return (data || []).map(map);
  } catch {
    return null;
  }
}

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  const [services, setServices] = useState<Service[]>(servicesData);
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [blogPostsState, setBlogPostsState] = useState<BlogPost[]>(blogPosts);
  const [leads, setLeads] = useState<LeadInquiry[]>(defaultLeads);
  const [careers, setCareers] = useState<CareerPosition[]>(defaultCareers);
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(defaultTestimonials);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    const alive = await pingCmsApi();
    setApiConnected(alive);

    const [svc, proj, blog, orders, cars, tests, media] = await Promise.all([
      safeList("/admin/services", serviceFromApi),
      safeList("/admin/projects", projectFromApi),
      safeList("/admin/blog", blogFromApi),
      safeList("/admin/orders", leadFromOrder),
      safeList("/admin/careers", careerFromApi, true, {
        sortBy: "created_at",
        sortOrder: "desc",
      }),
      safeList("/admin/testimonials", testimonialFromApi),
      safeList("/admin/media", mediaFromApi),
    ]);

    let settingsMapped: SiteSettings | null = null;
    try {
      const { cmsFetch } = await import("@/lib/cmsApi");
      const { data } = await cmsFetch<Record<string, unknown>>("/admin/settings");
      settingsMapped = settingsFromApi(data);
    } catch {
      try {
        const { cmsFetch } = await import("@/lib/cmsApi");
        const { data } = await cmsFetch<Record<string, unknown>>(
          "/public/settings",
          {},
          { auth: false }
        );
        settingsMapped = settingsFromApi(data);
      } catch {
        settingsMapped = null;
      }
    }

    if (svc) setServices(svc.length ? svc : servicesData);
    if (proj) setProjects(proj.length ? proj : projectsData);
    if (blog) setBlogPostsState(blog.length ? blog : blogPosts);
    if (orders) setLeads(orders);
    if (cars) setCareers(cars.length ? cars : defaultCareers);
    if (tests) setTestimonials(tests.length ? tests : defaultTestimonials);
    // Empty DB is valid — do not fall back to fake local media after API success
    if (media) setMediaAssets(media);
    if (settingsMapped) setSettings(settingsMapped);

    if (svc || proj || blog || orders) setApiConnected(true);
    setLoading(false);
  }, []);

  const refreshLeads = useCallback(async () => {
    const orders = await safeList("/admin/orders", leadFromOrder);
    if (orders) {
      setLeads(orders);
      setApiConnected(true);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  // Poll new contact leads so admin CRM + bell stay live
  useEffect(() => {
    const id = window.setInterval(() => {
      void refreshLeads();
    }, 5000);
    const onFocus = () => void refreshLeads();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshLeads]);

  /* ---- Services ---- */
  const addService = async (service: Service) => {
    try {
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/services",
        serviceToApi(service)
      );
      setServices((prev) => [serviceFromApi(created), ...prev]);
    } catch {
      setServices((prev) => [service, ...prev]);
    }
  };

  const updateService = async (updated: Service) => {
    try {
      if (isUuid(updated.id)) {
        const row = await apiUpdate<Record<string, unknown>>(
          `/admin/services/${updated.id}`,
          serviceToApi(updated)
        );
        setServices((prev) =>
          prev.map((s) => (s.id === updated.id ? serviceFromApi(row) : s))
        );
        return;
      }
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/services",
        serviceToApi(updated)
      );
      setServices((prev) =>
        prev.map((s) => (s.id === updated.id ? serviceFromApi(created) : s))
      );
    } catch {
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }
  };

  const deleteService = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/services/${id}`);
    } catch {
      /* local remove anyway */
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  /* ---- Projects ---- */
  const addProject = async (project: Project) => {
    try {
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/projects",
        projectToApi(project)
      );
      setProjects((prev) => [projectFromApi(created), ...prev]);
    } catch {
      setProjects((prev) => [project, ...prev]);
    }
  };

  const updateProject = async (updated: Project) => {
    try {
      if (isUuid(updated.id)) {
        const row = await apiUpdate<Record<string, unknown>>(
          `/admin/projects/${updated.id}`,
          projectToApi(updated)
        );
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? projectFromApi(row) : p))
        );
        return;
      }
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/projects",
        projectToApi(updated)
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? projectFromApi(created) : p))
      );
    } catch {
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/projects/${id}`);
    } catch {
      /* */
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  /* ---- Blog ---- */
  const addBlogPost = async (post: BlogPost) => {
    try {
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/blog",
        blogToApi(post)
      );
      setBlogPostsState((prev) => [blogFromApi(created), ...prev]);
    } catch {
      setBlogPostsState((prev) => [post, ...prev]);
    }
  };

  const updateBlogPost = async (updated: BlogPost) => {
    try {
      if (isUuid(updated.id)) {
        const row = await apiUpdate<Record<string, unknown>>(
          `/admin/blog/${updated.id}`,
          blogToApi(updated)
        );
        setBlogPostsState((prev) =>
          prev.map((b) => (b.id === updated.id ? blogFromApi(row) : b))
        );
        return;
      }
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/blog",
        blogToApi(updated)
      );
      setBlogPostsState((prev) =>
        prev.map((b) => (b.id === updated.id ? blogFromApi(created) : b))
      );
    } catch {
      setBlogPostsState((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/blog/${id}`);
    } catch {
      /* */
    }
    setBlogPostsState((prev) => prev.filter((b) => b.id !== id));
  };

  /* ---- Leads / Orders ---- */
  const updateLeadStatus = async (id: string, status: LeadInquiry["status"]) => {
    try {
      if (isUuid(id)) {
        await apiPatch(`/admin/orders/${id}/status`, {
          status: leadStatusToApi(status),
        });
      }
    } catch {
      /* */
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const deleteLead = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/orders/${id}`);
    } catch {
      /* */
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  /* ---- Careers ---- */
  const addCareer = async (career: CareerPosition) => {
    try {
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/careers",
        careerToApi(career)
      );
      setCareers((prev) => [careerFromApi(created), ...prev]);
    } catch {
      setCareers((prev) => [career, ...prev]);
    }
  };

  const updateCareer = async (updated: CareerPosition) => {
    try {
      if (isUuid(updated.id)) {
        const row = await apiUpdate<Record<string, unknown>>(
          `/admin/careers/${updated.id}`,
          careerToApi(updated)
        );
        setCareers((prev) =>
          prev.map((c) => (c.id === updated.id ? careerFromApi(row) : c))
        );
        return;
      }
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/careers",
        careerToApi(updated)
      );
      setCareers((prev) =>
        prev.map((c) => (c.id === updated.id ? careerFromApi(created) : c))
      );
    } catch {
      setCareers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    }
  };

  const deleteCareer = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/careers/${id}`);
    } catch {
      /* */
    }
    setCareers((prev) => prev.filter((c) => c.id !== id));
  };

  /* ---- Testimonials ---- */
  const addTestimonial = async (item: TestimonialItem) => {
    try {
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/testimonials",
        testimonialToApi(item)
      );
      setTestimonials((prev) => [testimonialFromApi(created), ...prev]);
    } catch {
      setTestimonials((prev) => [item, ...prev]);
    }
  };

  const updateTestimonial = async (updated: TestimonialItem) => {
    try {
      if (isUuid(updated.id)) {
        const row = await apiUpdate<Record<string, unknown>>(
          `/admin/testimonials/${updated.id}`,
          testimonialToApi(updated)
        );
        setTestimonials((prev) =>
          prev.map((t) => (t.id === updated.id ? testimonialFromApi(row) : t))
        );
        return;
      }
      const created = await apiCreate<Record<string, unknown>>(
        "/admin/testimonials",
        testimonialToApi(updated)
      );
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? testimonialFromApi(created) : t))
      );
    } catch {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      if (isUuid(id)) await apiDelete(`/admin/testimonials/${id}`);
    } catch {
      /* */
    }
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const moderateTestimonial = async (id: string, approve: boolean) => {
    if (!isUuid(id)) return;
    await apiPatch(`/admin/testimonials/${id}/moderate`, { approve });
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isApproved: approve, isEnabled: approve }
          : t
      )
    );
  };

  /* ---- Media ---- */
  const addMediaAsset = async (asset: MediaAsset) => {
    const created = await apiCreate<Record<string, unknown>>("/admin/media", {
      filename: asset.filename,
      original_name: asset.filename,
      url: asset.url,
      media_type: asset.type === "video" ? "video" : "image",
      folder: "external",
    });
    const mapped = mediaFromApi(created);
    setMediaAssets((prev) => [mapped, ...prev.filter((m) => m.id !== mapped.id)]);
    return mapped;
  };

  const uploadMediaFile = async (file: File) => {
    const row = await apiUploadMedia(file, "uploads");
    const mapped = mediaFromApi(row as unknown as Record<string, unknown>);
    setMediaAssets((prev) => [mapped, ...prev.filter((m) => m.id !== mapped.id)]);
    return mapped;
  };

  const deleteMediaAsset = async (id: string) => {
    if (!isUuid(id)) {
      setMediaAssets((prev) => prev.filter((m) => m.id !== id));
      return;
    }
    await apiDelete(`/admin/media/${id}`);
    setMediaAssets((prev) => prev.filter((m) => m.id !== id));
  };

  /* ---- Settings ---- */
  const updateSettings = async (newSettings: SiteSettings) => {
    try {
      const { cmsFetch } = await import("@/lib/cmsApi");
      const { data } = await cmsFetch<Record<string, unknown>>("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settingsToApi(newSettings)),
      });
      const mapped = settingsFromApi(data);
      if (mapped) setSettings(mapped);
      else setSettings(newSettings);
    } catch {
      setSettings(newSettings);
    }
  };

  return (
    <AdminDataContext.Provider
      value={{
        loading,
        apiConnected,
        refreshAll,
        refreshLeads,
        services,
        projects,
        blogPosts: blogPostsState,
        leads,
        careers,
        testimonials,
        mediaAssets,
        settings,
        addService,
        updateService,
        deleteService,
        addProject,
        updateProject,
        deleteProject,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        updateLeadStatus,
        deleteLead,
        addCareer,
        updateCareer,
        deleteCareer,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        moderateTestimonial,
        addMediaAsset,
        uploadMediaFile,
        deleteMediaAsset,
        updateSettings,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context)
    throw new Error("useAdminData must be used within AdminDataProvider");
  return context;
};
