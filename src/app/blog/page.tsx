"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BlogZigzagSections } from "@/components/ui/BlogZigzagSections";
import { ParallaxBlogCard } from "@/components/ui/ParallaxBlogCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SocialCampaignsShowcase } from "@/components/ui/SocialCampaignsShowcase";
import { BlogPost } from "@/data/blog";
import { usePublicBlog } from "@/hooks/usePublicCms";
import { Search, Clock, ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function BlogPage() {
  const blogPosts = usePublicBlog();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = [
    "All",
    "Web Architecture",
    "AI & Machine Learning",
    "Design & UX",
    "Cloud Systems",
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCat =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-10 left-1/3 w-96 h-96 rounded-full bg-[#004d4d]/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <SectionHeader
        badgeText="Engineering Insights"
        title="Architectural Deep Dives &"
        gradientTitle="Technical Blueprints"
        subtitle="Articles, research notes, and benchmark studies written directly by our principal software architects."
      />

      <BlogZigzagSections posts={blogPosts} />

      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white/90 dark:bg-[#111726]/90 backdrop-blur-xl shadow-md"
      >
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#226263] text-white border border-[#226263]/30 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

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
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ delay: idx * 0.06, duration: 0.5, ease }}
            >
              <ParallaxBlogCard className="h-full">
                <div className="relative rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#111726] p-6 h-full flex flex-col justify-between overflow-visible shadow-xl transition-all duration-300">
                  <div className="parallax-frame absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300" />

                  <div>
                    <div className="parallax-bg relative w-full h-56 rounded-xl overflow-hidden mb-5 border border-slate-200 dark:border-slate-800">
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

                    <div className="parallax-content space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>{post.publishedDate}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#004d4d] dark:text-cyan-400" />{" "}
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="parallax-content pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="text-[11px]">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {post.author.name}
                        </div>
                        <div className="text-[9px] text-[#004d4d] dark:text-cyan-400">
                          {post.author.role}
                        </div>
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
                </div>
              </ParallaxBlogCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-slate-500 py-12"
        >
          No articles match your filters.
        </motion.p>
      )}

      <div className="pt-8 border-t border-slate-300 dark:border-slate-800/80">
        <SocialCampaignsShowcase />
      </div>

      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-3">
              <span>
                By {activeArticle.author.name} ({activeArticle.author.role})
              </span>
              <span>•</span>
              <span>{activeArticle.publishedDate}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeArticle.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveArticle(null)}
              >
                Close Article
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
