"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { useAdminData } from "@/context/AdminDataContext";
import {
  Folder,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function AdminMediaPage() {
  const { confirm } = useAdminUi();
  const {
    mediaAssets,
    addMediaAsset,
    uploadMediaFile,
    deleteMediaAsset,
    refreshAll,
    apiConnected,
    loading,
  } = useAdminData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [okFlash, setOkFlash] = useState("");

  const flashOk = (msg: string) => {
    setOkFlash(msg);
    setTimeout(() => setOkFlash(""), 2500);
  };

  const handleCopy = (url: string, id: string) => {
    void navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilename.trim() || !newUrl.trim()) return;
    setSaving(true);
    setError("");
    try {
      await addMediaAsset({
        id: `new-${Date.now()}`,
        filename: newFilename.trim(),
        url: newUrl.trim(),
        size: "—",
        type: newType,
        uploadedAt: new Date().toISOString().slice(0, 10),
      });
      setNewFilename("");
      setNewUrl("");
      flashOk("Saved to Supabase media_assets");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save media — login again / check backend"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadMediaFile(file);
      flashOk(`Uploaded ${file.name} to Storage + DB`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Ensure Storage bucket `media` exists (run 003_storage.sql)."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete media?",
      message: "Delete this media asset from Supabase?",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setError("");
    try {
      await deleteMediaAsset(id);
      flashOk("Deleted from database");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Media & Asset Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Files upload to Supabase Storage; rows save in `media_assets`. Refresh keeps them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshAll()}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md flex items-center gap-2 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh from DB
        </button>
      </div>

      {!apiConnected && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
          CMS API offline or not logged in — uploads will not persist. Start backend and login.
        </div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
          {error}
        </div>
      )}

      {okFlash && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {okFlash}
        </div>
      )}

      <GlowCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Register / Upload Media Asset</span>
          </h3>
          <label className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer inline-flex items-center gap-2">
            {uploading ? "Uploading to Supabase..." : "Upload File → Storage"}
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,application/pdf"
              className="hidden"
              onChange={(e) => void handleFileUpload(e)}
              disabled={uploading || saving}
            />
          </label>
        </div>
        <form
          onSubmit={(e) => void handleAddMedia(e)}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Name
            </label>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Public URL Path
            </label>
            <input
              type="text"
              required
              placeholder="https://... or /logo.png"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Asset Type
            </label>
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
            disabled={saving || uploading}
            className="px-4 py-2 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 h-9 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Add Asset"}</span>
          </button>
        </form>
      </GlowCard>

      <div className="text-xs text-slate-500 font-semibold">
        {mediaAssets.length} asset{mediaAssets.length === 1 ? "" : "s"} in library
      </div>

      {!loading && mediaAssets.length === 0 && (
        <GlowCard className="p-10 text-center space-y-2">
          <Folder className="w-8 h-8 mx-auto text-slate-400" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">No media in database</div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Upload a file or register a URL. After a successful save, refresh will still show it.
          </p>
        </GlowCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mediaAssets.map((asset) => (
          <GlowCard key={asset.id} className="p-4 space-y-3">
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center">
              {asset.type === "video" ? (
                <video
                  src={asset.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30 uppercase">
                {asset.type}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {asset.filename}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate" title={asset.url}>
                {asset.url} ({asset.size})
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
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
                type="button"
                onClick={() => void handleDelete(asset.id)}
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
