import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { GSAPRouteRefresh } from "@/components/ui/GSAPRouteRefresh";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { IntroVideoSplash } from "@/components/ui/IntroVideoSplash";
import { VisitTracker } from "@/components/ui/VisitTracker";
import { getSiteSettings } from "@/lib/siteSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = settings.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    keywords: keywords.length ? keywords : undefined,
    icons: {
      icon: [
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/favicon.png",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: settings.metaTitle,
      description: settings.metaDescription,
      type: "website",
      images: settings.ogImageUrl
        ? [{ url: settings.ogImageUrl }]
        : [{ url: "/logo-512.png", width: 512, height: 512, alt: "Kodraxelsoft" }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : ["/logo-512.png"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

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
          <IntroVideoSplash />
          <VisitTracker />

          <SmoothScroll>
            <GSAPRouteRefresh />
            <Navbar />
            <main className="flex-grow pt-24">{children}</main>
            <Footer settings={settings} />
            <WhatsAppButton
              phone={settings.contactPhone}
              companyName={settings.companyName}
            />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
