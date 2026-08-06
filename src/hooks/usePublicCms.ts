"use client";

import { useEffect, useState } from "react";
import {
  fetchPublicProjects,
  fetchPublicBlog,
  fetchPublicCareers,
  fetchPublicTestimonials,
} from "@/lib/publicContent";
import { servicesData } from "@/data/services";
import { projectsData, type Project } from "@/data/projects";
import { blogPosts, type BlogPost } from "@/data/blog";
import type { CareerPosition, TestimonialItem } from "@/types/admin";
import { testimonialsData } from "@/data/testimonials";
import { pricingData } from "@/data/pricing";

export function usePublicServices() {
  // Local catalog is source of truth for the marketing site services grid
  return servicesData;
}

export function usePublicProjects() {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  useEffect(() => {
    void fetchPublicProjects().then(setProjects);
  }, []);
  return projects;
}

export function usePublicBlog() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  useEffect(() => {
    void fetchPublicBlog().then(setPosts);
  }, []);
  return posts;
}

export function usePublicCareers() {
  const [careers, setCareers] = useState<CareerPosition[]>([]);
  useEffect(() => {
    void fetchPublicCareers().then(setCareers);
  }, []);
  return careers;
}

export function usePublicTestimonials() {
  const [items, setItems] = useState<TestimonialItem[]>(testimonialsData);
  useEffect(() => {
    void fetchPublicTestimonials().then(setItems);
  }, []);
  return items;
}

export function usePublicPricing() {
  // Local PKR packages are source of truth — do not let CMS overwrite with old USD plans
  return pricingData;
}
