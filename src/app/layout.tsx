import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GSAPRouteRefresh } from "@/components/ui/GSAPRouteRefresh";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kodraxelsoft | Ultra-Premium Software Engineering & AI Studio",
  description: "Elite software architecture laboratory specializing in Next.js web applications, custom AI model integration, and high-scale cloud infrastructure.",
  keywords: ["Next.js", "TypeScript", "GSAP", "AI Engineering", "Software Studio", "React Architect"],
  icons: {
    icon: "/ks-emblem.jpg",
    shortcut: "/ks-emblem.jpg",
    apple: "/ks-emblem.jpg"
  },
  openGraph: {
    title: "Kodraxelsoft | Software Engineering & AI Studio",
    description: "Architecting sub-50ms web platforms and autonomous AI systems for market leaders.",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('kodraxelsoft_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-white">
        <ThemeProvider>
          <SmoothScroll>
            <GSAPRouteRefresh />
            <Navbar />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
            <WhatsAppButton />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
