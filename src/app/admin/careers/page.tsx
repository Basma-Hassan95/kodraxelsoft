"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminUi } from "@/components/admin/AdminUiContext";
import { useAdminData } from "@/context/AdminDataContext";
import { CareerPosition } from "@/context/AdminDataContext";
import { cmsList } from "@/lib/cmsApi";
import type { JobApplication } from "@/types/admin";
import { applicationStatusClass } from "@/lib/applicationStatus";
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  MapPin,
  Inbox,
  RefreshCw,
  Briefcase,
  Phone,
} from "lucide-react";

const ROLE_CATEGORIES = [
  "Frontend Engineering",
  "Backend Engineering",
  "Full-Stack Engineering",
  "AI / Machine Learning",
  "Mobile Engineering",
  "DevOps / Cloud",
  "UI / UX Design",
  "Product / Project",
  "QA / Testing",
  "Other",
] as const;

const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
  "Remote",
] as const;

const inputClass =
  "w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

function parseRequirements(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter(Boolean);
}

export default function AdminCareersPage() {
  const { confirm } = useAdminUi();
  const { careers, addCareer, updateCareer, deleteCareer, apiConnected } =
    useAdminData();
  const [editingCareer, setEditingCareer] = useState<CareerPosition | null>(null);

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete role?",
      message: "Delete this career role? It will disappear from the careers page.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    await deleteCareer(id);
  };

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState<string>(EMPLOYMENT_TYPES[0]);
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("Remote / Hybrid");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDepartment("");
    setJobType(EMPLOYMENT_TYPES[0]);
    setSalary("");
    setLocation("Remote / Hybrid");
    setDescription("");
    setRequirementsText("");
    setEditingCareer(null);
  };

  const loadApplications = useCallback(async () => {
    setAppsLoading(true);
    setAppsError("");
    try {
      const { data } = await cmsList<JobApplication>("/admin/applications", {
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setApplications(data || []);
    } catch (err) {
      setAppsError(
        err instanceof Error
          ? err.message
          : "Failed to load applications"
      );
      setApplications([]);
    } finally {
      setAppsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApplications();
    const id = window.setInterval(() => void loadApplications(), 5000);
    return () => window.clearInterval(id);
  }, [loadApplications]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = parseRequirements(requirementsText);
    if (!title.trim() || !description.trim()) return;

    if (editingCareer) {
      void updateCareer({
        ...editingCareer,
        title: title.trim(),
        department,
        type: jobType,
        salary: salary.trim(),
        location: location.trim(),
        description: description.trim(),
        requirements,
      });
    } else {
      void addCareer({
        id: `role-${Date.now()}`,
        title: title.trim(),
        department,
        type: jobType,
        location: location.trim(),
        salary: salary.trim(),
        description: description.trim(),
        requirements,
        active: true,
      });
    }

    resetForm();
  };

  const handleEdit = (c: CareerPosition) => {
    setEditingCareer(c);
    setTitle(c.title);
    setDepartment(c.department || "");
    setJobType(c.type || EMPLOYMENT_TYPES[0]);
    setSalary(c.salary);
    setLocation(c.location);
    setDescription(c.description);
    setRequirementsText((c.requirements || []).join("\n"));
  };

  const newApps = applications.filter((a) => a.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Careers & Hiring Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Post full job roles (Frontend, Full-Stack, AI, etc.) with requirements. Applicants fill the complete form on `/careers/apply`.
        </p>
      </div>

      {!apiConnected && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 text-xs font-semibold">
          CMS API offline / not logged in — jobs and applications will not sync.
        </div>
      )}

      <GlowCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
            <Inbox className="w-4 h-4" />
            <span>
              Recent Applications ({applications.length}
              {newApps > 0 ? ` · ${newApps} new` : ""})
            </span>
          </h3>
          <a
            href="/admin/applications"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950"
          >
            Open full applicant profiles →
          </a>
        </div>

        {appsError && (
          <div className="text-xs text-rose-500 font-semibold">{appsError}</div>
        )}

        {!appsLoading && applications.length === 0 && (
          <p className="text-xs text-slate-500 py-4 text-center">
            No applications yet. Candidates apply via `/careers/apply` with full details + CV.
          </p>
        )}

        <div className="space-y-2">
          {applications.slice(0, 6).map((app) => (
            <a
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="block p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {app.applicant_name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${applicationStatusClass(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                <span>{app.career_title}</span>
                <span>{app.applicant_email}</span>
                {app.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {app.phone}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </GlowCard>

      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>
            {editingCareer ? `Edit Role: ${editingCareer.title}` : "Post New Job Opening"}
          </span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Next.js Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role category * (e.g. Frontend, Full-Stack, AI…)
              </label>
              <input
                type="text"
                required
                list="role-category-suggestions"
                placeholder="Type role category — Frontend Engineering, AI / ML…"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={inputClass}
              />
              <datalist id="role-category-suggestions">
                {ROLE_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Employment type *
              </label>
              <select
                required
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className={inputClass}
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salary / compensation
              </label>
              <input
                type="text"
                placeholder="e.g. $80k–$120k or PKR 250k–400k"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Remote / Lahore / Hybrid"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="What this role does, team, stack, impact…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Requirements (one per line) *
            </label>
            <textarea
              rows={5}
              required
              placeholder={"3+ years React / Next.js\nStrong TypeScript\nExperience with REST / GraphQL APIs"}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className={inputClass}
            />
            <p className="text-[10px] text-slate-400 mt-1">
              These show on the public careers page under each job. Applicants then fill the full hiring form (name, phone, address, CV, GitHub…).
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#226263] hover:bg-[#1a4f50] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingCareer ? "Save Job Role" : "Publish Job Opening"}
            </button>
            {editingCareer && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={() => void loadApplications()}
              className="ml-auto px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${appsLoading ? "animate-spin" : ""}`} />
              Refresh apps
            </button>
          </div>
        </form>
      </GlowCard>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Users className="w-4 h-4" /> Published Roles ({careers.length})
        </h3>
        {careers.length === 0 && (
          <p className="text-xs text-slate-500">No roles posted yet. Use the form above.</p>
        )}
        {careers.map((role) => (
          <GlowCard
            key={role.id}
            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold">
                  {role.department || "Role"}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-500/15 text-slate-500 text-[10px] font-bold inline-flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> {role.type}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Hiring
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {role.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {role.description}
              </p>

              {role.requirements?.length > 0 && (
                <ul className="text-[11px] text-slate-500 list-disc pl-4 space-y-0.5">
                  {role.requirements.slice(0, 4).map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                  {role.requirements.length > 4 && (
                    <li>+{role.requirements.length - 4} more</li>
                  )}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                {role.salary && (
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{role.salary}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                  <span>{role.location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(role)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(role.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 transition-colors"
                aria-label="Delete Role"
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
