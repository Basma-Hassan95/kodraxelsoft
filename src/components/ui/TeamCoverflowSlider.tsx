"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  stat: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "alex-vance",
    name: "Alexander Vance",
    role: "Principal Systems Architect",
    bio: "Specializing in high-throughput distributed microservices, sub-50ms edge caching, and zero-downtime database migrations.",
    stat: "Systems Built: 140+",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "elena-rostova",
    name: "Dr. Elena Rostova",
    role: "AI Research & Neural Pipelines Lead",
    bio: "Pioneering custom PyTorch RAG workflows, domain-specific LLM fine-tuning, and automated vector search clusters.",
    stat: "Models Fine-Tuned: 85+",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    role: "Cloud Infrastructure & DevOps Lead",
    bio: "Architecting multi-region Kubernetes clusters, automated IaC Terraform deployments, and zero-trust cloud security.",
    stat: "Uptime SLA: 99.99%",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Mobile & Web Performance Architect",
    bio: "Crafting sub-second Next.js WebGL experiences and 120Hz native-performance React Native mobile applications.",
    stat: "App Installs: 2M+",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
  }
];

export const TeamCoverflowSlider: React.FC = () => {
  return (
    <div className="w-full py-8 relative select-none">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="w-full !pb-14"
      >
        {teamMembers.map((member) => (
          <SwiperSlide
            key={member.id}
            className="!w-[85vw] sm:!w-[380px] max-w-[380px] transition-all duration-300"
          >
            <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-6 sm:p-8 shadow-2xl space-y-5 h-full flex flex-col justify-between group hover:border-[#004d4d] dark:hover:border-cyan-500/50 transition-colors duration-300">
              
              {/* Top Avatar Container */}
              <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Highlighted Stat Badge */}
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-center">
                  <span className="text-xs font-extrabold text-cyan-400 tracking-wide">
                    {member.stat}
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="space-y-2">
                <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
                  {member.role}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {member.bio}
                </p>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
