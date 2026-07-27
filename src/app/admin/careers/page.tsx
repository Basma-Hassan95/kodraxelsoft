"use client";

import React, { useState } from "react";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAdminData } from "@/context/AdminDataContext";
import { CareerPosition } from "@/context/AdminDataContext";
import { Users, Plus, Trash2, Edit3, DollarSign, MapPin } from "lucide-react";

export default function AdminCareersPage() {
  const { careers, addCareer, updateCareer, deleteCareer } = useAdminData();
  const [editingCareer, setEditingCareer] = useState<CareerPosition | null>(null);

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Frontend Engineering");
  const [salary, setSalary] = useState("$180,000 - $240,000");
  const [location, setLocation] = useState("San Francisco, CA / Remote");
  const [description, setDescription] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = ["7+ years experience", "Deep TypeScript & Next.js mastery", "High-scale WebGL apps"];

    if (editingCareer) {
      updateCareer({
        ...editingCareer,
        title,
        department,
        salary,
        location,
        description,
        requirements
      });
      setEditingCareer(null);
    } else {
      addCareer({
        id: `role-${Date.now()}`,
        title,
        department,
        type: "Full-Time",
        location,
        salary,
        description,
        requirements,
        active: true
      });
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (c: CareerPosition) => {
    setEditingCareer(c);
    setTitle(c.title);
    setDepartment(c.department);
    setSalary(c.salary);
    setLocation(c.location);
    setDescription(c.description);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Careers & Hiring Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Post open engineering roles, edit salary bands, job requirements, and active hiring badges.
        </p>
      </div>

      {/* Career Editor Form */}
      <GlowCard className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>{editingCareer ? `Edit Role: ${editingCareer.title}` : "Post New Engineering Opening"}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="Senior Principal Next.js Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Machine Learning Studio">Machine Learning Studio</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Product Architecture">Product Architecture</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary Range</label>
              <input
                type="text"
                required
                placeholder="$180,000 - $240,000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                placeholder="San Francisco, CA / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe core responsibilities and technical expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#004d4d] hover:bg-[#006666] text-white font-bold text-xs shadow-md transition-colors"
            >
              {editingCareer ? "Save Job Role" : "Publish Job Opening"}
            </button>
            {editingCareer && (
              <button
                type="button"
                onClick={() => setEditingCareer(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </GlowCard>

      {/* Careers List */}
      <div className="space-y-4">
        {careers.map((role) => (
          <GlowCard key={role.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 text-[10px] font-bold">
                  {role.department}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Hiring
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{role.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{role.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{role.salary}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#004d4d] dark:text-cyan-400" />
                  <span>{role.location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(role)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#004d4d] text-slate-700 dark:text-slate-300 hover:text-white transition-colors border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteCareer(role.id)}
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
