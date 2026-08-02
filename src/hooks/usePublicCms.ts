"use client";

import { useEffect, useState } from "react";
import {
  fetchPublicServices,
  fetchPublicProjects,
  fetchPublicBlog,
  fetchPublicCareers,
  fetchPublicTestimonials,
  fetchPublicPricing,
} from "@/lib/publicContent";
import { servicesData, type Service } from "@/data/services";
import { projectsData, type Project } from "@/data/projects";
import { blogPosts, type BlogPost } from "@/data/blog";
import type { CareerPosition, TestimonialItem, PricingPlan } from "@/types/admin";
import { testimonialsData } from "@/data/testimonials";
import { pricingData } from "@/data/pricing";

export function usePublicServices() {
  const [services, setServices] = useState<Service[]>(servicesData);
  useEffect(() => {
    void fetchPublicServices().then(setServices);
  }, []);
  return services;
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
  const [plans, setPlans] = useState<PricingPlan[]>(pricingData);
  useEffect(() => {
    void fetchPublicPricing().then(setPlans);
  }, []);
  return plans;
}
