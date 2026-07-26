"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Menu, X, ArrowRight, Layers } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Process", href: "/process" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-300/80 dark:border-slate-800/80 shadow-lg py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-200/80 dark:bg-[#111726]/90 p-1.5 rounded-full border border-slate-300 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  isActive
                    ? "text-white bg-[#004d4d] font-bold shadow-md border border-[#006666]/40"
                    : "text-slate-800 dark:text-slate-200 font-semibold hover:text-[#004d4d] dark:hover:text-[#20b2aa] hover:bg-slate-300/50 dark:hover:bg-slate-800/70"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs & Theme Toggle */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="teal-gradient"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => (window.location.href = "/contact")}
          >
            Start Project
          </Button>
        </div>

        {/* Mobile Right Bar */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 p-6 shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                    : "text-slate-900 dark:text-slate-100 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              <Button
                variant="teal-gradient"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/contact";
                }}
                className="w-full justify-center"
              >
                Start a Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
