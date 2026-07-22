"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import gsap from "gsap";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("kodraxelsoft_theme") as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    }
    return "dark";
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("kodraxelsoft_theme") as Theme | null;
    const currentTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(currentTheme);
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = (event?: React.MouseEvent) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("kodraxelsoft_theme", nextTheme);

    // Apply class immediately to HTML element
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Smooth GSAP ripple transition overlay
    const overlay = document.getElementById("theme-ripple-overlay");
    if (overlay && event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;

      gsap.set(overlay, {
        xPercent: -50,
        yPercent: -50,
        left: clickX,
        top: clickY,
        scale: 0,
        opacity: 0.8,
        borderRadius: "50%"
      });

      const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.5;

      gsap.to(overlay, {
        width: maxDim,
        height: maxDim,
        scale: 1,
        opacity: 0.15,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              gsap.set(overlay, { scale: 0 });
            }
          });
        }
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <div id="theme-ripple-overlay" aria-hidden="true" />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
