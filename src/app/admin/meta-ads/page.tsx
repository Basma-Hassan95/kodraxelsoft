"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  MetaAd,
  AdChannel,
  AdStatus,
  loadAdminMetaAds,
  saveMetaAd,
  deleteMetaAd,
  META_ADS_EVENT,
} from "@/lib/metaAds";
import {
  Megaphone,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  cta_text: "Learn More",
  link: "/contact",
  status: "active" as AdStatus,
  channel: "Meta / Facebook" as AdChannel,
  badge: "Sponsored Campaign",
};

export default function AdminMetaAdsPage() {
  const [ads, setAds] = useState<MetaAd[]>([]);
  const [editing, setEditing] = useState<MetaAd | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [savedFlash, setSavedFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const formRef = React.useRef<HTMLDivElement>(null);

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const list = await loadAdminMetaAds();
      setAds(list.sort((a, b) => a.display_order - b.display_order));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ads from API");
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onUpdate = () => void refresh({ silent: true });
    window.addEventListener(META_ADS_EVENT, onUpdate);
    return () => window.removeEventListener(META_ADS_EVENT, onUpdate);
  }, [refresh]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleEdit = (ad: MetaAd) => {
    setError("");
    setEditing(ad);
    setForm({
      title: ad.title,
      description: ad.description,
      image_url: ad.image_url || "",
      cta_text: ad.cta_text || "Learn More",
      link: ad.link || "/contact",
      status: ad.status || "active",
      channel: ad.channel || "Meta / Facebook",
      badge: ad.badge || "Sponsored Campaign",
    });
    // Bring form into view so edit feels immediate
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    const now = new Date().toISOString();
    const payload: MetaAd = {
      id: editing?.id || `new-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      cta_text: form.cta_text.trim() || "Learn More",
      link: form.link.trim() || "/contact",
      status: form.status,
      channel: form.channel,
      badge: form.badge.trim() || "Sponsored Campaign",
      display_order: editing?.display_order ?? ads.length,
      created_at: editing?.created_at || now,
      updated_at: now,
    };

    try {
      const saved = await saveMetaAd(payload);
      setAds((prev) => {
        const without = prev.filter((a) => a.id !== saved.id);
        return [...without, saved].sort((a, b) => a.display_order - b.display_order);
      });
      resetForm();
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      // Confirm against DB (don't block UI)
      void refresh({ silent: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Save failed — login again / check backend is running"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this Meta Ad? It will disappear from the website.")) return;
    setSaving(true);
    setError("");
    try {
      await deleteMetaAd(id);
      await refresh();
      if (editing?.id === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (ad: MetaAd) => {
    setSaving(true);
    setError("");
    try {
      const saved = await saveMetaAd({
        ...ad,
        status: ad.status === "active" ? "inactive" : "active",
      });
      setAds((prev) =>
        prev
          .map((a) => (a.id === saved.id ? saved : a))
          .sort((a, b) => a.display_order - b.display_order)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Advertising CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Meta Ads & Campaigns
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Synced with Supabase. Add / edit / delete here — Home & Blog campaigns update live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedFlash && (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Saved to Supabase
            </div>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh from DB
          </button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <GlowCard className="p-6 space-y-4">
        <div ref={formRef} className="scroll-mt-24">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
            {editing ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editing ? `Editing: ${editing.title}` : "Create New Meta Ad"}</span>
          </h3>
          {editing && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 mb-2">
              Changes will update this ad in Supabase (id: {editing.id.slice(0, 8)}…).
            </p>
          )}
        </div>

        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ad Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enterprise Next.js Edge Campaign"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel
              </label>
              <select
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value as AdChannel })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option>Meta / Facebook</option>
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short ad copy shown on the website campaign card..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Image URL
              </label>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://... or /uploads/ad.jpg"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Badge Text
              </label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Meta Enterprise Sponsored Ad"
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CTA Button Text
              </label>
              <input
                value={form.cta_text}
                onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5" /> CTA Link
              </label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/contact or https://..."
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as AdStatus })}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="active">Active (show on website)</option>
                <option value="inactive">Inactive (hidden)</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Update Ad" : "Publish Ad"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          All Ads ({ads.length}) · Active on site:{" "}
          {ads.filter((a) => a.status === "active").length}
          {loading ? " · Loading..." : ""}
        </h3>

        {!loading && ads.length === 0 && (
          <GlowCard className="p-8 text-center text-xs text-slate-500">
            No ads in Supabase yet. Create your first Meta Ad above.
          </GlowCard>
        )}

        {ads.map((ad) => (
          <GlowCard key={ad.id} className="p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex gap-4 min-w-0">
                <div className="w-20 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shrink-0">
                  {ad.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-400">
                      <Megaphone className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {ad.title}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ad.status === "active"
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                      }`}
                    >
                      {ad.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {ad.channel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="text-[10px] text-slate-500">
                    CTA: <strong className="text-cyan-400">{ad.cta_text}</strong> → {ad.link}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleToggle(ad)}
                  disabled={saving}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:border-cyan-400/40 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {ad.status === "active" ? (
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
                  onClick={() => handleEdit(ad)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(ad.id)}
                  disabled={saving}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 flex items-center gap-1.5 disabled:opacity-50"
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
