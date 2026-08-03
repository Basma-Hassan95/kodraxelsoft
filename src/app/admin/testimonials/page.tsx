"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { TestimonialItem } from "@/context/AdminDataContext";
import { Star, Plus, Trash2, Edit3, User, Quote } from "lucide-react";

export default function AdminTestimonialsPage() {
  const {
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    moderateTestimonial,
  } = useAdminData();
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [moderating, setModerating] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateTestimonial({
        ...editingItem,
        clientName,
        role,
        company,
        review,
        rating,
        avatar: avatar || editingItem.avatar
      });
      setEditingItem(null);
    } else {
      addTestimonial({
        id: `test-${Date.now()}`,
        clientName,
        role,
        company,
        review,
        rating,
        avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      });
    }

    setClientName("");
    setRole("");
    setCompany("");
    setReview("");
    setAvatar("");
  };

  const handleEdit = (item: TestimonialItem) => {
    setEditingItem(item);
    setClientName(item.clientName);
    setRole(item.role);
    setCompany(item.company);
    setReview(item.review);
    setRating(item.rating);
    setAvatar(item.avatar);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Client Testimonials & Social Proof
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage reviews. Website submissions stay pending until you Approve — then they show on the homepage.
        </p>
      </div>

      {testimonials.some((t) => t.isApproved === false) && (
        <GlowCard className="p-4 border border-amber-500/30 bg-amber-500/5">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
            Pending website reviews (
            {testimonials.filter((t) => t.isApproved === false).length})
          </div>
          <div className="space-y-3">
            {testimonials
              .filter((t) => t.isApproved === false)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.clientName}{" "}
                      <span className="font-normal text-slate-500">
                        · {item.company || "Website"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {item.review}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={moderating === item.id}
                      onClick={async () => {
                        setModerating(item.id);
                        try {
                          await moderateTestimonial(item.id, true);
                        } finally {
                          setModerating(null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                    >
                      Approve → Home
                    </button>
                    <button
                      type="button"
                      disabled={moderating === item.id}
                      onClick={async () => {
                        setModerating(item.id);
                        try {
                          await moderateTestimonial(item.id, false);
                          await deleteTestimonial(item.id);
                        } finally {
                          setModerating(null);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </GlowCard>
      )}

      {/* Editor Form */}
      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{editingItem ? `Edit Review: ${editingItem.clientName}` : "Add New Executive Client Review"}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Full Name *</label>
              <input
                type="text"
                required
                placeholder="Marcus Thorne"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role / Designation</label>
              <input
                type="text"
                required
                placeholder="VP of Engineering"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                placeholder="Velox Global Capital"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Review Statement *</label>
            <textarea
              rows={3}
              required
              placeholder="Kodraxelsoft engineered our portal with zero stutters..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingItem ? "Save Review Changes" : "Add Client Review"}
            </button>
            {editingItem && (
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {testimonials
          .filter((t) => t.isApproved !== false)
          .map((item) => (
          <GlowCard key={item.id} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-slate-400 opacity-40" />
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                &quot;{item.review}&quot;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.avatar} alt={item.clientName} className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{item.clientName}</div>
                  <div className="text-[10px] text-slate-500">{item.role} • {item.company}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTestimonial(item.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

    </div>
  );
}
