"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePublicProjects, usePublicServices } from "@/hooks/usePublicCms";
import { servicesData, type Service } from "@/data/services";
import type { Project } from "@/data/projects";
import {
  heroMediaIsVideo,
  loadPublicHeroSlides,
  type HeroSlide as CmsHeroSlide,
} from "@/lib/heroCms";

type HeroSlide = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  mediaUrl?: string;
  mediaLink?: string;
};

type MediaItem = {
  id: string;
  title: string;
  label: string;
  image?: string;
  videoUrl?: string;
  href: string;
};

const HERO_SERVICE_IDS = [
  "web-architecture",
  "ai-integration",
  "mobile-enterprise",
  "ai-automation",
] as const;

const TEXT_INTERVAL_MS = 4500;
const MEDIA_INTERVAL_MS = 3200;

function splitTitle(title: string): { title: string; highlight: string } {
  if (title.includes(" & ")) {
    const [left, right] = title.split(" & ");
    return { title: `${left} &`, highlight: right.trim() };
  }
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) {
    return {
      title: words.slice(0, -1).join(" ") || title,
      highlight: words.at(-1) || "",
    };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    title: words.slice(0, mid).join(" "),
    highlight: words.slice(mid).join(" "),
  };
}

function serviceToSlide(service: Service): HeroSlide {
  const { title, highlight } = splitTitle(service.title);
  const benefits = service.features.slice(0, 3).join(" · ");
  return {
    id: service.id,
    title,
    highlight,
    description: `${service.subtitle}. Benefits: ${benefits}.`,
  };
}

function buildServiceSlides(services: Service[]): HeroSlide[] {
  const byId = new Map(services.map((s) => [s.id, s]));
  const picked = HERO_SERVICE_IDS.map((id) => byId.get(id)).filter(
    (s): s is Service => Boolean(s)
  );
  const pool = picked.length >= 3 ? picked : services.slice(0, 4);
  return pool.slice(0, 4).map(serviceToSlide);
}

function cmsToSlide(s: CmsHeroSlide): HeroSlide {
  return {
    id: s.id,
    title: s.title,
    highlight: s.highlight,
    description: s.description,
    mediaUrl: s.mediaUrl,
    mediaLink: s.mediaLink,
  };
}

function projectReel(projects: Project[]): Project[] {
  const withMedia = projects.filter((p) => Boolean(p.image || p.videoUrl));
  const featured = withMedia.filter((p) => p.featured);
  const pool = featured.length >= 2 ? featured : withMedia;
  return pool.slice(0, 6);
}

/** Browser / laptop-style frame for hero media */
function HeroMediaMockup({ item }: { item: MediaItem }) {
  const hostHint = (() => {
    try {
      if (item.href.startsWith("http")) return new URL(item.href).hostname;
    } catch {
      /* ignore */
    }
    return "kodraxelsoft.com";
  })();

  return (
    <Link
      href={item.href}
      className="group relative mt-8 block w-full max-w-2xl sm:max-w-3xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9994] rounded-2xl"
      aria-label={item.title}
    >
      {/* Soft glow behind mockup */}
      <div className="pointer-events-none absolute -inset-4 bg-[#1C9994]/18 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

      {/* Perspective tilt on hover */}
      <motion.div
        className="relative"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {/* Laptop / browser chassis */}
        <div className="relative rounded-[1.1rem] sm:rounded-[1.35rem] bg-gradient-to-b from-slate-700 via-slate-900 to-[#070b12] p-[0.35rem] sm:p-[0.45rem] shadow-[0_28px_60px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(28,153,148,0.25)]">
          {/* Top bezel / browser chrome */}
          <div className="rounded-t-[0.85rem] sm:rounded-t-[1.05rem] bg-[#0e1522] border-b border-white/5 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="mx-auto max-w-[14rem] sm:max-w-xs rounded-md bg-black/40 border border-white/8 px-2.5 py-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1C9994] shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate tracking-wide">
                  {hostHint}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 shrink-0 opacity-40">
              <span className="h-1 w-3 rounded-full bg-white/40" />
              <span className="h-1 w-3 rounded-full bg-white/25" />
            </div>
          </div>

          {/* Screen */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-b-[0.85rem] sm:rounded-b-[1.05rem] bg-[#041018] ring-1 ring-inset ring-white/5">
            <AnimatePresence mode="sync">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {item.videoUrl ? (
                  <video
                    key={item.videoUrl}
                    src={item.videoUrl}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={item.image}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#041628]/85 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left pointer-events-none">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                {item.label}
              </p>
              <p className="mt-0.5 text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-cyan-100 transition-colors">
                {item.title}
              </p>
            </div>
          </div>
        </div>

        {/* Laptop base / chin */}
        <div className="relative mx-auto -mt-px w-[102%] -translate-x-[1%] h-2.5 sm:h-3 rounded-b-xl bg-gradient-to-b from-slate-600 to-slate-900 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.8)]">
          <div className="absolute left-1/2 top-0.5 -translate-x-1/2 h-1 w-10 sm:w-14 rounded-full bg-slate-800/90" />
        </div>
      </motion.div>
    </Link>
  );
}

export function HeroMessageCarousel({
  initialSlides = [],
}: {
  initialSlides?: CmsHeroSlide[];
}) {
  const services = usePublicServices();
  const projects = usePublicProjects();
  const [cmsSlides, setCmsSlides] = useState<HeroSlide[]>(() =>
    initialSlides.length ? initialSlides.map(cmsToSlide) : []
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [cmsReady, setCmsReady] = useState(initialSlides.length > 0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const rows = await loadPublicHeroSlides();
      if (cancelled) return;
      if (rows.length) {
        setCmsSlides(rows.map(cmsToSlide));
        setSlideIndex(0);
      }
      setCmsReady(true);
    };
    void load();
    const onFocus = () => void load();
    const timer = window.setInterval(() => void load(), 20000);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const fallbackSlides = useMemo(() => {
    const source = services.length ? services : servicesData;
    return buildServiceSlides(source);
  }, [services]);

  const slides =
    cmsSlides.length > 0
      ? cmsSlides
      : cmsReady
        ? fallbackSlides
        : initialSlides.length
          ? initialSlides.map(cmsToSlide)
          : fallbackSlides;

  const cmsMedia = useMemo(
    () =>
      slides
        .filter((s) => Boolean(s.mediaUrl))
        .map(
          (s): MediaItem => ({
            id: s.id,
            title: `${s.title} ${s.highlight}`.trim(),
            label: "Featured",
            image: heroMediaIsVideo(s.mediaUrl || "") ? undefined : s.mediaUrl,
            videoUrl: heroMediaIsVideo(s.mediaUrl || "")
              ? s.mediaUrl
              : undefined,
            href: s.mediaLink || "/portfolio",
          })
        ),
    [slides]
  );

  const projectMedia = useMemo(() => projectReel(projects), [projects]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, TEXT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    const len = cmsMedia.length > 0 ? cmsMedia.length : projectMedia.length;
    if (len < 2) return;
    const id = window.setInterval(() => {
      setMediaIndex((i) => (i + 1) % len);
    }, MEDIA_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [cmsMedia.length, projectMedia.length]);

  const active = slides[slideIndex] ?? fallbackSlides[0];
  const useCmsMedia = cmsMedia.length > 0;
  const activeCmsMedia = cmsMedia[mediaIndex % Math.max(cmsMedia.length, 1)];
  const activeProject = projectMedia[mediaIndex % Math.max(projectMedia.length, 1)];

  const activeMedia: MediaItem | null = useCmsMedia
    ? activeCmsMedia || null
    : activeProject
      ? {
          id: activeProject.id,
          title: activeProject.title,
          label: activeProject.category,
          image: activeProject.image,
          videoUrl: activeProject.videoUrl,
          href: `/portfolio/${activeProject.id}`,
        }
      : null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden min-h-[10.5rem] sm:min-h-[12.5rem] md:min-h-[14rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ x: "55%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-55%", opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full text-center"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-5xl mx-auto">
              <span className="text-slate-900 dark:text-white">
                {active.title}{" "}
              </span>
              <span className="text-gradient-teal">{active.highlight}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed">
              {active.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {activeMedia ? <HeroMediaMockup item={activeMedia} /> : null}
    </div>
  );
}
