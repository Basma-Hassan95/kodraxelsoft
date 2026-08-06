"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { cmsList, apiCreate, apiUpdate, apiDelete, isUuid } from "@/lib/cmsApi";
import { pricingFromApi, pricingToApi, stripCurrencySymbol } from "@/lib/cmsMappers";
import type { PricingPlan } from "@/types/admin";
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  RefreshCw,
} from "lucide-react";

const inputClass =
  "w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  compareAtPrice: "",
  discountPercent: "0",
  discountLabel: "",
  featuresText: "",
  badge: "",
  isFeatured: false,
  isActive: true,
};

function parseFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export default function AdminPricingPage() {
  const { confirm } = useAdminUi();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [savedFlash, setSavedFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const formRef = React.useRef<HTMLDivElement>(null);

  const refresh = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const { data } = await cmsList<Record<string, unknown>>(
        "/admin/pricing-plans",
        { limit: 100, sortBy: "display_order", sortOrder: "asc" }
      );
      setPlans((data || []).map(pricingFromApi));
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load pricing plans from API"
      );
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleEdit = (plan: PricingPlan) => {
    setError("");
    setEditing(plan);
    setForm({
      title: plan.title,
      subtitle: plan.subtitle,
      description: plan.description,
      price: plan.price,
      compareAtPrice: plan.compareAtPrice,
      discountPercent: String(plan.discountPercent || 0),
      discountLabel: plan.discountLabel,
      featuresText: plan.features.join("\n"),
      badge: plan.badge,
      isFeatured: plan.isFeatured,
      isActive: plan.isActive,
    });
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price.trim()) {
      setError("Title and price are required");
      return;
    }
    setSaving(true);
    setError("");

    const payload: PricingPlan = {
      id: editing?.id || "",
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      price: stripCurrencySymbol(form.price.trim()),
      compareAtPrice: stripCurrencySymbol(form.compareAtPrice.trim()),
      discountPercent: Number(form.discountPercent) || 0,
      discountLabel: form.discountLabel.trim(),
      features: parseFeatures(form.featuresText),
      badge: form.badge.trim(),
      ctaText: editing?.ctaText || "Contact Us",
      ctaLink: editing?.ctaLink || "/contact",
      serviceSlug: editing?.serviceSlug || "",
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      displayOrder: editing?.displayOrder ?? plans.length,
    };

    try {
      if (editing && isUuid(editing.id)) {
        await apiUpdate<Record<string, unknown>>(
          `/admin/pricing-plans/${editing.id}`,
          pricingToApi(payload)
        );
      } else {
        await apiCreate<Record<string, unknown>>(
          "/admin/pricing-plans",
          pricingToApi(payload)
        );
      }
      resetForm();
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
      await refresh({ silent: true });
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
    const ok = await confirm({
      title: "Delete pricing plan?",
      message: "Delete this pricing plan? It will disappear from the website.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setSaving(true);
    setError("");
    try {
      if (isUuid(id)) await apiDelete(`/admin/pricing-plans/${id}`);
      await refresh();
      if (editing?.id === id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan: PricingPlan) => {
    setSaving(true);
    setError("");
    try {
      const updated = { ...plan, isActive: !plan.isActive };
      if (isUuid(plan.id)) {
        await apiUpdate<Record<string, unknown>>(
          `/admin/pricing-plans/${plan.id}`,
          pricingToApi(updated)
        );
      }
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
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
            <Tag className="w-3.5 h-3.5" />
            <span>Pricing CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Pricing Plans
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Synced with Supabase. Add / edit / delete plans — the public `/pricing` page updates live.
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
            <span>{editing ? `Editing: ${editing.title}` : "Create New Pricing Plan"}</span>
          </h3>
        </div>

        <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Plan Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Growth Platform"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subtitle
              </label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="For scaling product teams"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short summary shown on the pricing card..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price *
              </label>
              <input
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="22,000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Compare-At Price
              </label>
              <input
                value={form.compareAtPrice}
                onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
                placeholder="28,000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount Label
              </label>
              <input
                value={form.discountLabel}
                onChange={(e) => setForm({ ...form, discountLabel: e.target.value })}
                placeholder="Early Bird"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Features (one per line)
            </label>
            <textarea
              rows={5}
              value={form.featuresText}
              onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
              placeholder={"Next.js 16 App Router build\nCustom design system\n4-6 weeks delivery"}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Badge Text
              </label>
              <input
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Most Popular"
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-cyan-500"
              />
              Featured plan (highlighted)
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-cyan-500"
              />
              Active (show on website)
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Update Plan" : "Publish Plan"}
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
          All Plans ({plans.length}) · Active on site:{" "}
          {plans.filter((p) => p.isActive).length}
          {loading ? " · Loading..." : ""}
        </h3>

        {!loading && plans.length === 0 && (
          <GlowCard className="p-8 text-center text-xs text-slate-500">
            No pricing plans in Supabase yet. Create your first plan above.
          </GlowCard>
        )}

        {plans.map((plan) => (
          <GlowCard key={plan.id} className="p-5">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {plan.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20">
                    {plan.price}
                  </span>
                  {plan.compareAtPrice && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {plan.compareAtPrice}
                    </span>
                  )}
                  {plan.discountPercent > 0 && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                      -{plan.discountPercent}%
                    </span>
                  )}
                  {plan.isFeatured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      plan.isActive
                        ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                        : "bg-slate-500/15 text-slate-400 border border-slate-500/30"
                    }`}
                  >
                    {plan.isActive ? "active" : "inactive"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {plan.description}
                </p>
                <div className="text-[10px] text-slate-500">
                  {plan.features.length} feature{plan.features.length === 1 ? "" : "s"}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleToggleActive(plan)}
                  disabled={saving}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:border-cyan-400/40 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {plan.isActive ? (
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
                  onClick={() => handleEdit(plan)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(plan.id)}
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
