"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface CaseStudyProject {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  image: string;
  videoUrl?: string;
  impactMetrics: { label: string; value: string }[];
  technologies: string[];
  /** External live site URL — opens in new tab with a short lag */
  link?: string;
}

interface CaseStudies3DSliderProps {
  projects: CaseStudyProject[];
}

export const CaseStudies3DSlider: React.FC<CaseStudies3DSliderProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isFadingDetails, setIsFadingDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const total = projects.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goTo = (targetIdx: number, dir?: "next" | "prev") => {
    if (isAnimating || targetIdx === currentIndex) return;

    const navDir = dir || (targetIdx > currentIndex ? "next" : "prev");
    setDirection(navDir);
    setNextIndex(targetIdx);
    setIsAnimating(true);
    setIsFadingDetails(true);

    // Mid-point transition (250ms): update display text & fade back in
    setTimeout(() => {
      setDisplayIndex(targetIdx);
      setIsFadingDetails(false);
    }, 250);

    // Full 3D slice animation completion (650ms)
    setTimeout(() => {
      setCurrentIndex(targetIdx);
      setIsAnimating(false);
    }, 650);
  };

  const handleNext = () => {
    const target = (currentIndex + 1) % total;
    goTo(target, "next");
  };

  const handlePrev = () => {
    const target = (currentIndex - 1 + total) % total;
    goTo(target, "prev");
  };

  const activeProject = projects[displayIndex] || projects[currentIndex];
  const currentImage = projects[currentIndex].image;
  const nextImage = projects[nextIndex].image;

  const handleOpenProject = () => {
    const url = activeProject.link;
    if (!url) {
      window.location.href = `/portfolio#${activeProject.id}`;
      return;
    }
    // Brief lag so the click feels intentional / premium
    setIsFadingDetails(true);
    window.setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setIsFadingDetails(false);
    }, 420);
  };

  const MediaFace = ({
    image,
    videoUrl,
    bgYPercent,
  }: {
    image: string;
    videoUrl?: string;
    bgYPercent: number;
  }) =>
    videoUrl ? (
      <video
        src={videoUrl}
        muted
        loop
        autoPlay
        playsInline
        poster={image}
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <div
        className="absolute inset-0 backface-hidden bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: `center ${bgYPercent}%`,
        }}
      />
    );

  // 4 Horizontal Slices for 3D Cube Rotation
  const slices = [0, 1, 2, 3];

  return (
    <div className="space-y-6">
      {/* Dual Column Case Study Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-xl overflow-visible relative group">
        
        {/* Left Column: 3D Cube-Slice Image Transition (7 Cols) */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-72 sm:h-96 select-none bg-slate-900">
          
          {!isMobile ? (
            /* Desktop: 3D Cube-Slice Image Transition */
            <div className="relative w-full h-full perspective-1000">
              {slices.map((sliceIdx) => {
                const sliceHeightPercent = 100 / slices.length; // 25% each
                const bgYPercent = (sliceIdx / (slices.length - 1)) * 100; // 0%, 33.3%, 66.6%, 100%
                const delayMs = sliceIdx * 80; // Staggered timing

                return (
                  <div
                    key={sliceIdx}
                    className="relative w-full overflow-hidden preserve-3d"
                    style={{
                      height: `${sliceHeightPercent}%`,
                    }}
                  >
                    <div
                      className="w-full h-full relative preserve-3d transition-transform duration-650 ease-in-out"
                      style={{
                        transitionDelay: `${isAnimating ? delayMs : 0}ms`,
                        transform: isAnimating
                          ? `rotateX(${direction === "next" ? -90 : 90}deg)`
                          : "rotateX(0deg)",
                      }}
                    >
                      {/* Front Face */}
                      <div
                        className="absolute inset-0 backface-hidden overflow-hidden"
                        style={{ transform: "translateZ(144px)" }}
                      >
                        <MediaFace
                          image={currentImage}
                          videoUrl={
                            sliceIdx === 0
                              ? projects[currentIndex]?.videoUrl
                              : undefined
                          }
                          bgYPercent={bgYPercent}
                        />
                      </div>

                      {/* Next Face */}
                      <div
                        className="absolute inset-0 backface-hidden overflow-hidden"
                        style={{
                          transform:
                            direction === "next"
                              ? "rotateX(90deg) translateZ(144px)"
                              : "rotateX(-90deg) translateZ(144px)",
                        }}
                      >
                        <MediaFace
                          image={nextImage}
                          videoUrl={
                            sliceIdx === 0
                              ? projects[nextIndex]?.videoUrl
                              : undefined
                          }
                          bgYPercent={bgYPercent}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Mobile: image or video */
            <div className="relative w-full h-full">
              {activeProject.videoUrl ? (
                <video
                  key={activeProject.id}
                  src={activeProject.videoUrl}
                  poster={activeProject.image}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="w-full h-full object-cover transition-opacity duration-400"
                />
              )}
            </div>
          )}

          {/* Category Tag Overlay */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-cyan-400 border border-cyan-500/30 shadow-md">
            {activeProject.category}
            {activeProject.videoUrl ? " · Video" : ""}
          </div>

          {/* Next / Prev Navigation Arrow Buttons */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Previous Case Study"
              className="pointer-events-auto p-2.5 rounded-full bg-slate-950/70 hover:bg-[#004d4d] text-white backdrop-blur-md border border-slate-700 hover:border-cyan-400 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Next Case Study"
              className="pointer-events-auto p-2.5 rounded-full bg-slate-950/70 hover:bg-[#004d4d] text-white backdrop-blur-md border border-slate-700 hover:border-cyan-400 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Right Column: Case Study Details Panel (5 Cols) */}
        <div
          className={`lg:col-span-5 space-y-5 transition-all duration-300 ${
            isFadingDetails ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="text-xs font-semibold text-[#004d4d] dark:text-cyan-400 uppercase tracking-wider">
            {activeProject.client}
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {activeProject.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {activeProject.description}
          </p>

          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100 dark:bg-[#090d16] border border-slate-200 dark:border-slate-800">
            {activeProject.impactMetrics.map((metric, mIdx) => (
              <div key={mIdx} className="text-center">
                <div className="text-base font-extrabold text-[#004d4d] dark:text-cyan-400">
                  {metric.value}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tech Badges List */}
          <div className="flex flex-wrap gap-2 pt-2">
            {activeProject.technologies.slice(0, 4).map((tech, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-700/50"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA — opens live site with lag, or portfolio fallback */}
          <div className="pt-2 flex flex-wrap gap-2">
            <Button
              variant="teal-gradient"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={handleOpenProject}
            >
              {activeProject.link ? "Open Live Project" : "View Case Study"}
            </Button>
            {activeProject.link && (
              <Link href={`/portfolio#${activeProject.id}`}>
                <Button variant="outline" size="md">
                  Case details
                </Button>
              </Link>
            )}
          </div>
        </div>

      </div>

      {/* Interactive Slider Indicators */}
      <div className="flex items-center justify-center gap-2.5 pt-2">
        {projects.map((proj, idx) => (
          <button
            key={proj.id}
            onClick={() => goTo(idx)}
            disabled={isAnimating}
            aria-label={`Go to slide ${idx + 1}: ${proj.title}`}
            className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
              displayIndex === idx
                ? "w-8 bg-[#004d4d] dark:bg-cyan-400 shadow-md"
                : "w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
