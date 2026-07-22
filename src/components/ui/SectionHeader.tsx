import React from "react";
import { Sparkles } from "lucide-react";

interface SectionHeaderProps {
  badgeText: string;
  title: string;
  gradientTitle?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badgeText,
  title,
  gradientTitle,
  subtitle,
  align = "center",
  className = ""
}) => {
  const alignment =
    align === "center" ? "text-center items-center" : align === "right" ? "text-right items-end" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignment} mb-12 md:mb-16 ${className}`}>
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
        <span>{badgeText}</span>
      </div>

      {/* Main Title */}
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight max-w-3xl">
        {title}{" "}
        {gradientTitle && (
          <span className="text-gradient-teal drop-shadow-sm">{gradientTitle}</span>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
