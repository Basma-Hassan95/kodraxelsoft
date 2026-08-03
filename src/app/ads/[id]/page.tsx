"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { GSAPReveal } from "@/components/ui/GSAPReveal";
import {
  loadPublicMetaAdById,
  type MetaAd,
} from "@/lib/metaAds";
import {
  InstagramBrandIcon,
  LinkedInBrandIcon,
  MetaBrandIcon,
} from "@/components/ui/SocialCampaignsShowcase";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Megaphone,
  Sparkles,
} from "lucide-react";

function ChannelIcon({ channel, className }: { channel: string; className?: string }) {
  if (channel === "LinkedIn") return <LinkedInBrandIcon className={className} />;
  if (channel === "Instagram") return <InstagramBrandIcon className={className} />;
  return <MetaBrandIcon className={className} />;
}

function channelLabel(channel: string) {
  if (channel === "Instagram") return "Instagram";
  if (channel === "LinkedIn") return "LinkedIn";
  if (channel === "Meta / Facebook") return "Facebook / Meta";
  return channel || "Social";
}

export default function PublicAdDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [ad, setAd] = useState<MetaAd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      const found = await loadPublicMetaAdById(id);
      if (!cancelled) {
        setAd(found);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center text-sm font-semibold text-[#004d4d] dark:text-cyan-400">
        Loading campaign…
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#004d4d]/10 text-[#004d4d] dark:text-cyan-400 flex items-center justify-center mx-auto">
          <Megaphone className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Ad Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          This campaign is inactive or no longer available.
        </p>
        <Link href="/">
          <Button
            variant="teal-gradient"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const rawLink = ad.link?.trim() || "";
  const selfLink = `/ads/${ad.id}`;
  const destination =
    !rawLink || rawLink === selfLink || rawLink.startsWith("/ads/")
      ? "/contact"
      : rawLink;
  const isExternal = /^https?:\/\//i.test(destination);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <GSAPReveal direction="down">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#004d4d] dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </GSAPReveal>

      <GSAPReveal direction="up">
        <GlowCard className="overflow-hidden p-0">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-950">
            {ad.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ad.image_url}
                alt={ad.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#004d4d] to-slate-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#041628]/90 via-[#041628]/35 to-transparent" />
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ad
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-white/15 text-white text-[10px] font-bold">
                <ChannelIcon channel={ad.channel} className="w-3.5 h-3.5" />
                {channelLabel(ad.channel)}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ad.badge || "Sponsored Campaign"}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {ad.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {ad.description ||
                  "This campaign was run on social media and is featured here from our Kodraxelsoft marketing showcase."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#004d4d]/25 bg-[#004d4d]/5 dark:bg-cyan-500/5 p-4 sm:p-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#004d4d] dark:text-cyan-400">
                Campaign placement
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Yeh ad{" "}
                <strong className="text-slate-900 dark:text-white">
                  {channelLabel(ad.channel)}
                </strong>{" "}
                pe laga / chalaya gaya tha. Neeche se aap related page open kar sakte ho ya seedha inquire kar sakte ho.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {isExternal ? (
                <a href={destination} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="teal-gradient"
                    size="lg"
                    icon={<ExternalLink className="w-4 h-4" />}
                    className="w-full sm:w-auto justify-center"
                  >
                    {ad.cta_text || "Open Campaign Link"}
                  </Button>
                </a>
              ) : (
                <Link href={destination}>
                  <Button
                    variant="teal-gradient"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto justify-center"
                  >
                    {ad.cta_text || "Continue"}
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto justify-center"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </GlowCard>
      </GSAPReveal>
    </div>
  );
}
