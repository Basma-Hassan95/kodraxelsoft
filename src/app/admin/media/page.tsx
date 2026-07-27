"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { Folder, Plus, Trash2, Copy, CheckCircle2, Film, Image as ImageIcon } from "lucide-react";

export default function AdminMediaPage() {
  const { mediaAssets, addMediaAsset, deleteMediaAsset } = useAdminData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"image" | "video">("image");

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFilename && newUrl) {
      addMediaAsset({
        id: `m-${Date.now()}`,
        filename: newFilename,
        url: newUrl,
        size: "1.2 MB",
        type: newType,
        uploadedAt: new Date().toISOString().split("T")[0]
      });
      setNewFilename("");
      setNewUrl("");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Media & Asset Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload, manage, and copy URLs of website brand assets, logos, and video reveals (`video1.mp4`, `video2.mp4`).
          </p>
        </div>
      </div>

      {/* Add New Media Form */}
      <GlowCard className="p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Register / Link New Media Asset</span>
        </h3>
        <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Name</label>
            <input
              type="text"
              required
              placeholder="e.g. hero-banner.jpg"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Public URL Path</label>
            <input
              type="text"
              required
              placeholder="e.g. /video1.mp4 or /logo.png"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "image" | "video")}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              <option value="image">Image Asset</option>
              <option value="video">Video Asset (.mp4)</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 h-9"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        </form>
      </GlowCard>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaAssets.map((asset) => (
          <GlowCard key={asset.id} className="p-4 space-y-3">
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center">
              {asset.type === "video" ? (
                <video src={asset.url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
              )}
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30 uppercase">
                {asset.type}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {asset.filename}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {asset.url} ({asset.size})
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleCopy(asset.url, asset.id)}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedId === asset.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => deleteMediaAsset(asset.id)}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                aria-label="Delete asset"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlowCard>
        ))}
      </div>

    </div>
  );
}
