"use client";

import React from "react";
import {
  AESTHETIC_OPTIONS,
  DESIGN_OPTIONS,
  DOMAIN_HOSTING_OPTIONS,
  INTEGRATION_OPTIONS,
  TIMELINE_OPTIONS,
  type ProjectBriefAnswers,
} from "@/lib/contactBriefOptions";

const inputClass =
  "w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40";

function ChoiceGroup<T extends string>({
  number,
  title,
  options,
  value,
  onChange,
}: {
  number: number;
  title: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-2">
        {number}. {title}
      </label>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full p-3 rounded-xl border text-left text-[12px] sm:text-[13px] font-semibold transition-all ${
              value === opt.id
                ? "border-[#004d4d] bg-[#004d4d]/10 text-[#004d4d] dark:border-cyan-500/50 dark:bg-cyan-500/10 dark:text-cyan-300 shadow-sm"
                : "border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#004d4d]/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContactProjectBrief({
  value,
  onChange,
}: {
  value: ProjectBriefAnswers;
  onChange: (next: ProjectBriefAnswers) => void;
}) {
  const set = <K extends keyof ProjectBriefAnswers>(
    key: K,
    next: ProjectBriefAnswers[K]
  ) => onChange({ ...value, [key]: next });

  return (
    <div className="space-y-5 pt-2 border-t border-slate-200 dark:border-slate-800">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#004d4d] dark:text-cyan-400">
        Project brief
      </p>

      <ChoiceGroup
        number={1}
        title="Do you have a design ready?"
        options={DESIGN_OPTIONS}
        value={value.designReady}
        onChange={(id) => set("designReady", id)}
      />

      <ChoiceGroup
        number={2}
        title="Domain & hosting setup?"
        options={DOMAIN_HOSTING_OPTIONS}
        value={value.domainHosting}
        onChange={(id) => set("domainHosting", id)}
      />

      <ChoiceGroup
        number={3}
        title="Custom database or APIs integration?"
        options={INTEGRATION_OPTIONS}
        value={value.integrations}
        onChange={(id) => set("integrations", id)}
      />

      <ChoiceGroup
        number={4}
        title="Preferred aesthetics / theme style?"
        options={AESTHETIC_OPTIONS}
        value={value.aesthetic}
        onChange={(id) => set("aesthetic", id)}
      />

      <ChoiceGroup
        number={5}
        title="Target launch timeline?"
        options={TIMELINE_OPTIONS}
        value={value.timeline}
        onChange={(id) => set("timeline", id)}
      />

      <div>
        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mb-2">
          6. Additional specifications or requirements?
        </label>
        <textarea
          rows={3}
          value={value.additionalSpecs}
          onChange={(e) => set("additionalSpecs", e.target.value)}
          className={inputClass}
          placeholder="e.g. custom shopping API, multi-language support, payment gateway, admin panel…"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Reference website{" "}
          <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          type="url"
          value={value.referenceWebsite}
          onChange={(e) => set("referenceWebsite", e.target.value)}
          className={inputClass}
          placeholder="https://example.com — style reference"
        />
      </div>
    </div>
  );
}
