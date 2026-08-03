"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  HeroSlide,
  deleteHeroSlide,
  loadAdminHeroSlides,
  saveHeroSlide,
} from "@/lib/heroCms";
import { apiUploadMedia } from "@/lib/cmsApi";
import {
  LayoutTemplate,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const emptyForm = {
  title: "",
  highlight: "",
  description: "",
  mediaUrl: "",
  mediaLink: "",
  isActive: true,
};

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSlides(await loadAdminHeroSlides());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      highlight: slide.highlight,
      description: slide.description,
      mediaUrl: slide.mediaUrl,
      mediaLink: slide.mediaLink,
      isActive: slide.isActive,
    });
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const asset = await apiUploadMedia(file, "hero");
      const url = (asset as { url?: string })?.url;
      if (url) setForm((f) => ({ ...f, mediaUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveHeroSlide({
        id: editing?.id,
        ...form,
      });
      await refresh();
      resetForm();
      setFlash(true);
      setTimeout(() => setFlash(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero slide from the homepage carousel?")) return;
    setSaving(true);
    try {
      await deleteHeroSlide(id);
      await refresh();
      if (editing?.id === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (slide: HeroSlide) => {
    setSaving(true);
    try {
      await saveHeroSlide({
        id: slide.id,
        title: slide.title,
        highlight: slide.highlight,
        description: slide.description,
        mediaUrl: slide.mediaUrl,
        mediaLink: slide.mediaLink,
        isActive: !slide.isActive,
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutTemplate className="w-3.5 h-3.5" />
            Homepage Hero
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Hero Carousel CMS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Manage homepage headline carousel text and the image/video card under it. Active slides
            rotate on the live site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {flash && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Saved
            </div>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          {editing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {editing ? `Editing slide` : "Add hero slide"}
        </h3>

        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Title (left part) *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Next.js Platforms Built for"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Highlight (teal part)</label>
              <input
                value={form.highlight}
                onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                placeholder="Speed & Scale"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description / benefits *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short supporting line shown under the headline…"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                Media URL (image or video)
              </label>
              <input
                value={form.mediaUrl}
                onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                placeholder="https://... or uploaded media URL"
                className={inputClass}
              />
              <label className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer hover:border-cyan-400/40">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "Uploading…" : "Upload image/video"}
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm"
                  className="hidden"
                  onChange={(e) => void handleUpload(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Media click link (optional)
              </label>
              <input
                value={form.mediaLink}
                onChange={(e) => setForm({ ...form, mediaLink: e.target.value })}
                placeholder="/portfolio/aegis-ai or /services/..."
                className={inputClass}
              />
              <label className="mt-3 flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Active on homepage carousel
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Update slide" : "Add slide"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Slides ({slides.length}) · Active: {slides.filter((s) => s.isActive).length}
        </h3>
        {!loading && slides.length === 0 && (
          <GlowCard className="p-8 text-center text-xs text-slate-500">
            No hero slides yet. Add your first carousel slide above.
          </GlowCard>
        )}
        {slides.map((slide) => (
          <GlowCard key={slide.id} className="p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex gap-4 min-w-0">
                <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shrink-0">
                  {slide.mediaUrl ? (
                    /\.(mp4|webm)/i.test(slide.mediaUrl) ? (
                      <div className="w-full h-full flex items-center justify-center text-cyan-400">
                        <Video className="w-5 h-5" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slide.mediaUrl} alt="" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                      No media
                    </div>
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {slide.title}{" "}
                      <span className="text-[#004d4d] dark:text-cyan-400">{slide.highlight}</span>
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        slide.isActive
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-slate-500/15 text-slate-400"
                      }`}
                    >
                      {slide.isActive ? "active" : "hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{slide.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleToggle(slide)}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5"
                >
                  {slide.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> Show
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(slide)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(slide.id)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}
