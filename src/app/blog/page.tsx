"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SocialCampaignsShowcase } from "@/components/ui/SocialCampaignsShowcase";
import { blogPosts, BlogPost } from "@/data/blog";
import { Search, Clock, ArrowRight, BookOpen, Sparkles } from "lucide-react";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = ["All", "Web Architecture", "AI & Machine Learning", "Design & UX", "Cloud Systems"];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
      
      {/* Header */}
      <GSAPReveal direction="down">
        <SectionHeader
          badgeText="Engineering Insights"
          title="Architectural Deep Dives &"
          gradientTitle="Technical Blueprints"
          subtitle="Articles, research notes, and benchmark studies written directly by our 4 founding engineers."
        />
      </GSAPReveal>

      {/* Search & Category Filter Bar */}
      <GSAPReveal direction="up">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] shadow-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>
        </div>
      </GSAPReveal>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post, idx) => (
          <GSAPReveal key={post.id} direction="up" delay={idx * 0.1}>
            <GlowCard className="h-full flex flex-col justify-between p-6">
              <div>
                <div className="relative w-full h-56 rounded-xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>{post.publishedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-500" /> {post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & CTA Bar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="text-[11px]">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{post.author.name}</div>
                    <div className="text-[9px] text-cyan-600 dark:text-cyan-400">{post.author.role}</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveArticle(post)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Read Article
                </Button>
              </div>
            </GlowCard>
          </GSAPReveal>
        ))}
      </div>

      {/* Social Media Ads & Campaign Highlights Section */}
      <div className="pt-8 border-t border-slate-300 dark:border-slate-800/80">
        <SocialCampaignsShowcase />
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span>By {activeArticle.author.name} ({activeArticle.author.role})</span>
              <span>•</span>
              <span>{activeArticle.publishedDate}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeArticle.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveArticle(null)}>
                Close Article
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
