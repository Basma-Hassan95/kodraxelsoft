"use client";

import React, { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Save, CheckCircle2, Globe, Search, Share2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminData();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Global Site Configuration & SEO Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Dynamically manage Google SEO Metadata, Search Snippets, Social Share Cards, and Studio Contact channels. Changes apply live to Footer, Contact page, WhatsApp button, and site SEO.
        </p>
      </div>

      <GlowCard className="p-6 space-y-6">
        {saved && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Site settings updated — SEO, Footer, Contact & WhatsApp now use these values.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Dynamic SEO Metadata Controls */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>1. Google Search Engine SEO Optimization (Meta Tags)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Search Title Tag (&amp;lt;title&amp;gt;) *
              </label>
              <input
                type="text"
                required
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">Optimal length: 50-60 characters for best Google SERP ranking.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Search Meta Description (&amp;lt;meta name=&quot;description&quot;&amp;gt;) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
              <p className="text-[11px] text-slate-400 mt-1">Optimal length: 150-160 characters. Appears as snippet under Google search results.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Focus SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Social Sharing Preview Image URL (OpenGraph / Twitter Card)
                </label>
                <input
                  type="text"
                  value={formData.ogImageUrl}
                  onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>2. Studio Contact Channels & Location</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Company / Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Email</label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">HQ Office Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          {/* Section 3: Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>3. Social Media Handles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Twitter / X URL</label>
                <input
                  type="text"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Site & SEO Settings</span>
          </button>

        </form>
      </GlowCard>

    </div>
  );
}
