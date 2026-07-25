"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Check, Calculator, ArrowRight, Sparkles } from "lucide-react";

interface EstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EstimatorModal: React.FC<EstimatorModalProps> = ({ isOpen, onClose }) => {
  const [projectType, setProjectType] = useState<string>("web");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["auth", "design"]);
  const [timelineSpeed, setTimelineSpeed] = useState<"standard" | "expedited">("standard");

  const projectTypes = [
    { id: "web", name: "Next.js Web App", base: 15000, weeks: 4 },
    { id: "ai", name: "AI Model & Agents", base: 22000, weeks: 5 },
    { id: "cloud", name: "Cloud Infrastructure", base: 18000, weeks: 4 },
    { id: "mobile", name: "React Native Mobile App", base: 20000, weeks: 6 }
  ];

  const featuresList = [
    { id: "auth", name: "User Auth & RBAC Security", price: 2000 },
    { id: "design", name: "Custom Design System & GSAP Motion", price: 3500 },
    { id: "payment", name: "Stripe / Crypto Payments", price: 2500 },
    { id: "ai_chat", name: "Custom AI Assistant & RAG Vector Search", price: 6000 },
    { id: "analytics", name: "Real-Time Telemetry & Admin Dashboard", price: 3000 }
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const currentType = projectTypes.find((t) => t.id === projectType) || projectTypes[0];
  const featureSum = selectedFeatures.reduce((acc, featId) => {
    const feat = featuresList.find((f) => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  const basePrice = currentType.base + featureSum;
  const totalPrice = timelineSpeed === "expedited" ? Math.round(basePrice * 1.25) : basePrice;
  const totalWeeks = timelineSpeed === "expedited" ? Math.max(2, currentType.weeks - 1) : currentType.weeks;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Interactive Project Cost & Timeline Estimator">
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Configure your product requirements below to generate an instant scope estimate backed by our 4 founders&apos; delivery SLA.
        </p>

        {/* Step 1: Project Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
            1. Select Primary Architecture
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projectTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setProjectType(type.id)}
                className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                  projectType === type.id
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div>{type.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">From ${type.base.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Features */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
            2. Select Add-on Capabilities
          </label>
          <div className="space-y-2">
            {featuresList.map((feat) => {
              const checked = selectedFeatures.includes(feat.id);
              return (
                <div
                  key={feat.id}
                  onClick={() => toggleFeature(feat.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    checked
                      ? "border-cyan-500/60 bg-cyan-500/5 text-slate-900 dark:text-slate-100"
                      : "border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        checked
                          ? "bg-cyan-500 border-cyan-500 text-white"
                          : "border-slate-400 dark:border-slate-600"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{feat.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    +${feat.price.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Speed */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
            3. Delivery Speed
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTimelineSpeed("standard")}
              className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                timelineSpeed === "standard"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Standard Sprint Speed
            </button>
            <button
              onClick={() => setTimelineSpeed("expedited")}
              className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                timelineSpeed === "expedited"
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              Expedited Sprint (+25%)
            </button>
          </div>
        </div>

        {/* Estimation Output Card */}
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-100 dark:bg-[#090d16] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Estimated Total Investment
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-baseline gap-2">
              <span>${totalPrice.toLocaleString()}</span>
              <span className="text-xs font-normal text-cyan-600 dark:text-cyan-400">
                (~{totalWeeks} Weeks)
              </span>
            </div>
          </div>

          <Button
            variant="teal-gradient"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              onClose();
              window.location.href = `/contact?type=${projectType}&budget=$${totalPrice.toLocaleString()}`;
            }}
          >
            Lock In Estimate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
