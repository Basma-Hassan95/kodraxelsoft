"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { BlogPost } from "@/data/blog";
import { PenTool, Plus, Trash2, Edit3, Calendar, User } from "lucide-react";

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAdminData();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Web Architecture");
  const [authorName, setAuthorName] = useState("Dr. Aris Thorne");
  const [readTime, setReadTime] = useState("6 min read");
  const [content, setContent] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = ["Next.js 16", "Performance", "Web Architecture"];

    if (editingPost) {
      updateBlogPost({
        ...editingPost,
        title,
        excerpt,
        category,
        author: { ...editingPost.author, name: authorName },
        readTime,
        content: content ? content.split("\n\n") : editingPost.content
      });
      setEditingPost(null);
    } else {
      addBlogPost({
        id: `post-${Date.now()}`,
        slug: title.toLowerCase().replace(/ /g, "-"),
        title,
        excerpt,
        category,
        publishedDate: new Date().toISOString().split("T")[0],
        readTime,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        featured: true,
        author: {
          name: authorName,
          role: "Principal Software Architect",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        },
        content: content ? content.split("\n\n") : ["## Architectural Overview", "High performance WebGL rendering..."]
      });
    }

    setTitle("");
    setExcerpt("");
    setContent("");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setAuthorName(post.author.name);
    setReadTime(post.readTime);
    setContent(Array.isArray(post.content) ? post.content.join("\n\n") : "");
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Engineering Blog & Publisher
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Write, publish, edit, or delete technical engineering articles with Markdown content.
        </p>
      </div>

      {/* Article Publisher Form */}
      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{editingPost ? `Edit Article: ${editingPost.title}` : "Write & Publish New Technical Article"}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Article Title *</label>
              <input
                type="text"
                required
                placeholder="Architecting Sub-50ms Next.js Platforms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogPost["category"])}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="Web Architecture">Web Architecture</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud Systems">Cloud Systems</option>
                <option value="Design & UX">Design & UX</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Article Excerpt Summary *</label>
            <textarea
              rows={2}
              required
              placeholder="Short summary displayed on the blog feed..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Article Markdown Content</label>
            <textarea
              rows={6}
              placeholder="Write article in markdown format (# Heading, ## Section, code blocks)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingPost ? "Save Article Changes" : "Publish Technical Article"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {/* Blog Feed List */}
      <div className="space-y-4">
        {blogPosts.map((post) => (
          <GlowCard key={post.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase">
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {post.publishedDate}</span>
                <span className="text-xs text-slate-400 font-medium">• {post.readTime}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{post.excerpt}</p>
              
              <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 pt-1">
                <User className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                <span>Author: {post.author.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(post)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteBlogPost(post.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                aria-label="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </GlowCard>
        ))}
      </div>

    </div>
  );
}
