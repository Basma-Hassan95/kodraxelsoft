"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "teal-gradient";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

/** Site-wide button brand color */
export const BUTTON_COLOR = "#226263";
export const BUTTON_COLOR_HOVER = "#1a4f50";

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "right",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#226263]/45 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#226263] hover:bg-[#1a4f50] text-white shadow-md border border-[#226263]/50 dark:bg-[#226263] dark:hover:bg-[#1a4f50]",
    "teal-gradient":
      "bg-[#226263] hover:bg-[#1a4f50] dark:bg-[#226263] dark:hover:bg-[#1a4f50] text-white font-semibold shadow-md border border-[#226263]/50",
    secondary:
      "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 shadow-sm",
    outline:
      "border border-[#226263]/50 dark:border-[#226263]/60 bg-transparent text-[#226263] dark:text-[#226263] hover:bg-[#226263]/10 hover:border-[#226263]",
    ghost:
      "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-[#226263]/10 hover:text-[#226263] dark:hover:text-[#226263]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
