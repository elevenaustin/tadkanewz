import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Facebook,
  Flame,
  Globe,
  Heart,
  MessageCircle,
  Play,
  Pause,
  Printer,
  Share2,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Tag,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsSidebar } from "@/components/news/sidebar";
import { SectionTitle } from "@/components/news/section-title";
import { StoryCard } from "@/components/news/story-card";
import { stories } from "@/lib/news-data";
import encounterThumb from "@/assets/gulab-sidhu-encounter.jpg";

export const Route = createFileRoute("/newslink")({
  head: () => ({
    meta: [
      {
        title:
          "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ — TadkaNewz",
      },
      {
        name: "description",
        content:
          "ਬਰਨਾਲਾ (ਪੁਨੀਤ) - ਬਰਨਾਲਾ ਪੁਲਸ ਨੇ ਪੰਜਾਬੀ ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਹੋਈ ਫਾਇਰਿੰਗ ਦੀ ਘਟਨਾ ਨੂੰ ਸੁਲਝਾਉਂਦੇ ਹੋਏ ਵੱਡੀ ਸਫਲਤਾ ਹਾਸਲ ਕੀਤੀ ਹੈ। ਪੁਲਸ ਐਨਕਾਊਂਟਰ ਦੌਰਾਨ ਮੁੱਖ ਸ਼ੂਟਰ ਜ਼ਖ਼ਮੀ।",
      },
      {
        property: "og:title",
        content:
          "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ",
      },
      {
        property: "og:description",
        content:
          "ਬਰਨਾਲਾ ਪੁਲਸ ਵੱਲੋਂ ਐਨਕਾਊਂਟਰ ਤੋਂ ਬਾਅਦ ਗਿਰੋਹ ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਅਸਲੇ ਅਤੇ ਗੱਡੀਆਂ ਸਮੇਤ ਗ੍ਰਿਫ਼ਤਾਰ ਕੀਤਾ ਗਿਆ।",
      },
      { property: "og:type", content: "article" },
      { property: "og:image", content: encounterThumb },
      { property: "og:url", content: "/newslink" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/newslink" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline:
            "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ",
          image: [encounterThumb],
          datePublished: "2026-09-22T12:44:00+05:30",
          dateModified: "2026-09-22T12:44:00+05:30",
          author: {
            "@type": "Person",
            name: "Cherry",
          },
          publisher: {
            "@type": "Organization",
            name: "TadkaNewz",
            logo: {
              "@type": "ImageObject",
              url: "/favicon.svg",
            },
          },
          articleSection: "Entertainment",
        }),
      },
    ],
  }),
  component: NewsLinkArticlePage,
});

function NewsLinkArticlePage() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(248);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ - TadkaNewz\n" +
        window.location.href
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  };

  // Speech synthesis reader for news
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const text =
        "ਵੱਡੀ ਖ਼ਬਰ। ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ। ਬਰਨਾਲਾ ਪੁਲਸ ਨੇ ਪੰਜਾਬੀ ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਹੋਈ ਫਾਇਰਿੰਗ ਦੀ ਘਟਨਾ ਨੂੰ ਸੁਲਝਾਉਂਦੇ ਹੋਏ ਵੱਡੀ ਸਫਲਤਾ ਹਾਸਲ ਕੀਤੀ ਹੈ।";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pa-IN";
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getFontSizeClass = () => {
    if (fontSize === "large") return "text-[20px] leading-[2.1]";
    if (fontSize === "xlarge") return "text-[22px] leading-[2.2]";
    return "text-[18px] sm:text-[19px] leading-[1.95]";
  };

  return (
    <div className="mx-auto max-w-site px-4 py-6 sm:px-6">
      {/* Top Breadcrumb & Breaking News Alert Banner */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">
            ਮੁੱਖ ਪੰਨਾ
          </Link>
          <span>/</span>
          <Link
            to="/category/$category"
            params={{ category: "entertainment" }}
            className="transition-colors hover:text-primary"
          >
            ਮਨੋਰੰਜਨ
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">ਵੱਡੀ ਖ਼ਬਰ</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            BREAKING NEWS
          </span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2.15fr)_minmax(300px,1fr)]">
        {/* Main Article Column */}
        <article className="min-w-0">
          {/* Category Tag & Breaking Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-red-600 px-3 py-1 text-xs font-black tracking-wide text-white uppercase shadow-sm">
              <Flame className="size-3.5 fill-current" /> ਵੱਡੀ ਖ਼ਬਰ
            </span>
            <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-bold">
              Entertainment / ਮਨੋਰੰਜਨ
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1">
              <Clock className="size-3" /> 22 Sep, 2026 12:44 PM
            </span>
          </div>

          {/* Main Article Title */}
          <h1 className="mt-4 text-2xl font-black leading-[1.3] text-foreground sm:text-3xl md:text-4xl lg:text-[2.65rem]">
            ਵੱਡੀ ਖ਼ਬਰ ; ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ
          </h1>

          {/* Byline and Author Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-border py-3.5 bg-muted/30 px-3 rounded-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black text-sm">
                C
              </div>
              <div className="text-sm">
                <div className="font-bold text-foreground flex items-center gap-2">
                  <span>Edited By Cherry</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                    Verified Desk
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-0.5">
                  <span>Updated: 22 Sep, 2026 12:44 PM</span>
                  <span>•</span>
                  <span>ਬਰਨਾਲਾ (ਪੁਨੀਤ)</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Audio Read, Font Resize, Share, Save) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant={isPlayingAudio ? "default" : "outline"}
                size="sm"
                onClick={toggleSpeech}
                className="gap-1 text-xs h-8"
                title="ਖ਼ਬਰ ਸੁਣੋ (Listen News)"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="size-3.5" /> ਸੁਣਨਾ ਰੋਕੋ
                  </>
                ) : (
                  <>
                    <Volume2 className="size-3.5" /> ਖ਼ਬਰ ਸੁਣੋ
                  </>
                )}
              </Button>

              <div className="hidden sm:flex items-center border border-input rounded-sm bg-background">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`px-2 py-1 text-xs font-semibold ${
                    fontSize === "normal" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                  title="Normal Text"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`px-2 py-1 text-sm font-bold ${
                    fontSize === "large" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                  title="Larger Text"
                >
                  A+
                </button>
              </div>

              <Button
                size="icon"
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className="size-8"
                aria-label="ਪਸੰਦ ਕਰੋ"
              >
                <Heart className={`size-3.5 ${liked ? "fill-current" : ""}`} />
              </Button>

              <Button
                size="icon"
                variant={saved ? "default" : "outline"}
                onClick={() => setSaved(!saved)}
                className="size-8"
                aria-label="ਬੁੱਕਮਾਰਕ ਕਰੋ"
              >
                <Bookmark className={`size-3.5 ${saved ? "fill-current" : ""}`} />
              </Button>

              <Button
                size="icon"
                variant="outline"
                onClick={copyUrl}
                className="size-8"
                aria-label="ਲਿੰਕ ਕਾਪੀ ਕਰੋ"
              >
                {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons Strip */}
          <div className="my-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase mr-1">ਸਾਂਝਾ ਕਰੋ:</span>
            <Button
              size="sm"
              variant="outline"
              onClick={shareWhatsApp}
              className="gap-1.5 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800"
            >
              <MessageCircle className="size-3.5 fill-current" /> WhatsApp
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={shareFacebook}
              className="gap-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800"
            >
              <Facebook className="size-3.5 fill-current" /> Facebook
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={copyUrl}
              className="gap-1.5 text-xs"
            >
              <Share2 className="size-3.5" /> {copied ? "ਕਾਪੀ ਹੋ ਗਿਆ" : "ਕਾਪੀ ਲਿੰਕ"}
            </Button>
          </div>

          {/* Featured Thumbnail Banner (Matches the user's uploaded thumbnail) */}
          <figure className="relative my-6 overflow-hidden rounded-md border border-border shadow-lg bg-black">
            <img
              src={encounterThumb}
              alt="ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ ਗੋਲੀਆਂ ਚਲਾਉਣ ਵਾਲੇ ਬਦਮਾਸ਼ਾਂ ਦਾ ਐਨਕਾਊਂਟਰ"
              width={1280}
              height={720}
              className="w-full h-auto object-cover max-h-[520px] transition-transform duration-300 hover:scale-[1.01]"
              loading="eager"
            />
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 tracking-wider rounded-sm shadow">
              EXCLUSIVE VISUALS
            </div>
            <figcaption className="bg-ink/90 text-primary-foreground/90 p-3 text-xs leading-relaxed border-t border-border/20">
              <span className="font-bold text-primary mr-1.5">ਤਸਵੀਰ:</span>
              ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ ਅਤੇ ਪੁਲਿਸ ਵੱਲੋਂ ਕੀਤੀ ਗਈ ਗ੍ਰਿਫ਼ਤਾਰੀ ਦੀਆਂ ਖ਼ਾਸ ਤਸਵੀਰਾਂ। ਫੋਟੋ: TadkaNewz Special
            </figcaption>
          </figure>

          {/* Quick Highlight Box */}
          <div className="my-6 rounded-md border-l-4 border-red-600 bg-red-500/5 p-4 sm:p-5 dark:bg-red-950/20 border-border">
            <h3 className="flex items-center gap-2 font-black text-red-600 dark:text-red-400 text-base sm:text-lg">
              <ShieldAlert className="size-5" /> ਮੁੱਖ ਨੁਕਤੇ (Key Highlights)
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>ਘਟਨਾ:</strong> ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਬਰਨਾਲਾ ਸਥਿਤ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>ਕਾਰਵਾਈ:</strong> ਬਰਨਾਲਾ ਪੁਲਸ ਤੇ ਕਾਊਂਟਰ ਇੰਟੈਲੀਜੈਂਸ ਵੱਲੋਂ ਐਨਕਾਊਂਟਰ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>ਜ਼ਖਮੀ/ਗ੍ਰਿਫ਼ਤਾਰ:</strong> ਮੁੱਖ ਸ਼ੂਟਰ ਗੁਰਵਿੰਦਰ ਸਿੰਘ ਲੱਤ ਵਿੱਚ ਗੋਲੀ ਲੱਗਣ ਨਾਲ ਜ਼ਖਮੀ।</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>ਬਰਾਮਦਗੀ:</strong> 2 'ਜਿਗਿਆਨਾ' ਪਿਸਟਲਾਂ, 2 ਦੇਸੀ ਪਿਸਟਲਾਂ, ਅਰਟਿਗਾ ਕਾਰ।</span>
              </li>
            </ul>
          </div>

          {/* Article Full Body Copy */}
          <div className={`article-copy py-2 text-foreground ${getFontSizeClass()}`}>
            {/* Paragraph 1 */}
            <p className="font-semibold text-foreground/95">
              <span className="font-black text-red-600 text-xl tracking-tight mr-1">
                ਬਰਨਾਲਾ (ਪੁਨੀਤ) -
              </span>
              ਬਰਨਾਲਾ ਪੁਲਸ ਨੇ ਪੰਜਾਬੀ ਗਾਇਕ ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਹੋਈ ਫਾਇਰਿੰਗ ਦੀ ਘਟਨਾ ਨੂੰ ਸੁਲਝਾਉਂਦੇ ਹੋਏ ਵੱਡੀ ਸਫਲਤਾ ਹਾਸਲ ਕੀਤੀ ਹੈ। ਡੀ.ਆਈ.ਜੀ. ਪਟਿਆਲਾ ਰੇਂਜ ਦੀ ਅਗਵਾਈ ਅਤੇ ਐਸ.ਐਸ.ਪੀ. ਬਰਨਾਲਾ ਸੰਜੀਵ ਗੋਇਲ ਦੇ ਨਿਰਦੇਸ਼ਾਂ ਹੇਠ ਪੁਲਸ ਅਤੇ ਕਾਊਂਟਰ ਇੰਟੈਲੀਜੈਂਸ ਦੀਆਂ ਟੀਮਾਂ ਨੇ ਐਨਕਾਊਂਟਰ ਤੋਂ ਬਾਅਦ ਗਿਰੋਹ ਦੇ ਮੈਂਬਰਾਂ ਨੂੰ ਅਸਲੇ ਅਤੇ ਗੱਡੀਆਂ ਸਮੇਤ ਗ੍ਰਿਫ਼ਤਾਰ ਕੀਤਾ ਹੈ।
            </p>

            {/* Related Read Box 1 */}
            <div className="my-6 rounded-sm border-l-4 border-primary bg-muted p-4 transition-colors hover:bg-muted/80">
              <span className="text-xs font-black uppercase text-primary tracking-wider block mb-1">
                ਇਹ ਵੀ ਪੜ੍ਹੋ (RELATED NEWS)
              </span>
              <a
                href="https://jagbani.punjabkesari.in/entertainment/news/moushumi-chatterjee-s-advice-to-her-daughter-1672124"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-base sm:text-lg"
              >
                'ਬੁਆਏਫ੍ਰੈਂਡ ਬਣਾਓ, ਪਰ ਵਿਆਹ ਕਰਵਾਉਣਾ ਜ਼ਰੂਰੀ ਨਹੀਂ'; ਦਿੱਗਜ ਬਾਲੀਵੁੱਡ ਅਦਾਕਾਰਾ ਨੇ ਧੀ ਨੂੰ ਦਿੱਤੀ 'ਖਾਸ' ਸਲਾਹ
                <ExternalLink className="size-4 shrink-0 text-primary" />
              </a>
            </div>

            {/* Paragraph 2 */}
            <p>
              ਦੱਸ ਦੇਈਏ ਕਿ ਬੀਤੇ ਦਿਨੀਂ ਗਾਇਕ ਦੇ ਬਰਨਾਲਾ ਦੇ ਪਿੰਡ ਫਰਵਾਹੀ ਸਥਿਤ ਘਰ ਦੇ ਬਾਹਰ ਦੇਰ ਰਾਤ ਇੱਕ ਮੋਟਰਸਾਈਕਲ 'ਤੇ ਸਵਾਰ ਹੋ ਕੇ ਆਏ 3 ਅਣਪਛਾਤੇ ਵਿਅਕਤੀਆਂ ਵੱਲੋਂ 7 ਤੋਂ 8 ਰਾਊਂਡ ਫਾਇਰ ਕੀਤੇ ਗਏ ਸਨ। ਪ੍ਰੈੱਸ ਕਾਨਫ਼ਰੰਸ ਦੌਰਾਨ ਪਟਿਆਲਾ ਰੇਂਜ ਦੇ ਡੀਆਈਜੀ ਕੁਲਦੀਪ ਸਿੰਘ ਚਹਿਲ ਨੇ ਕਿਹਾ ਕਿ ਪੁਲਸ ਨੂੰ ਬਰਨਾਲਾ-ਮਾਨਸਾ ਰੋਡ 'ਤੇ ਸ਼ੱਕੀਆਂ ਦੀ ਮੌਜੂਦਗੀ ਦੀ ਇਤਲਾਹ ਮਿਲੀ ਸੀ। ਜਦੋਂ ਪੁਲਸ ਟੀਮਾਂ ਮਾਨਸਾ ਸਾਈਡ ਤੋਂ ਆ ਰਹੇ ਇੱਕ ਬਿਨਾਂ ਨੰਬਰ ਵਾਲੇ ਮੋਟਰਸਾਈਕਲ ਨੂੰ ਰੋਕਣ ਦਾ ਇਸ਼ਾਰਾ ਕੀਤਾ ਤਾਂ ਮੋਟਰਸਾਈਕਲ ਸਵਾਰਾਂ ਨੇ ਭੱਜਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕੀਤੀ। ਪੁਲਸ ਵੱਲੋਂ ਘੇਰਾਬੰਦੀ ਕਰਨ 'ਤੇ ਮੋਟਰਸਾਈਕਲ ਦੇ ਪਿੱਛੇ ਬੈਠੇ ਵਿਅਕਤੀ ਨੇ ਪੁਲਸ ਪਾਰਟੀ 'ਤੇ ਜਾਨਲੇਵਾ ਫਾਇਰਿੰਗ ਕਰ ਦਿੱਤੀ, ਜਿਸ 'ਤੇ ਪੁਲਸ ਵੱਲੋਂ ਆਤਮ-ਰੱਖਿਆ ਵਜੋਂ ਕੀਤੀ ਗਈ ਜਵਾਬੀ ਫਾਇਰਿੰਗ ਦੌਰਾਨ ਮੁੱਖ ਸ਼ੂਟਰ ਗੁਰਵਿੰਦਰ ਸਿੰਘ ਦੀ ਸੱਜੀ ਲੱਤ ਵਿੱਚ ਗੋਲੀ ਲੱਗ ਗਈ ਅਤੇ ਦੂਜਾ ਦੋਸ਼ੀ ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ ਮੋਟਰਸਾਈਕਲ ਤੋਂ ਡਿੱਗ ਕੇ ਜ਼ਖਮੀ ਹੋ ਗਿਆ।
            </p>

            {/* Related Read Box 2 */}
            <div className="my-6 rounded-sm border-l-4 border-primary bg-muted p-4 transition-colors hover:bg-muted/80">
              <span className="text-xs font-black uppercase text-primary tracking-wider block mb-1">
                ਇਹ ਵੀ ਪੜ੍ਹੋ (RELATED NEWS)
              </span>
              <a
                href="https://jagbani.punjabkesari.in/entertainment/news/veteran-actress-loses-battle-with-cancer-1671976#google_vignette"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-base sm:text-lg"
              >
                ਮਨੋਰੰਜਨ ਇੰਡਸਟਰੀ 'ਚ ਪਸਰਿਆ ਮਾਤਮ, ਕੈਂਸਰ ਤੋਂ ਜੰਗ ਹਾਰੀ ਦਿੱਗਜ ਅਦਾਕਾਰਾ
                <ExternalLink className="size-4 shrink-0 text-primary" />
              </a>
            </div>

            {/* Paragraph 3 */}
            <p>
              ਡੀਆਈਜੀ ਨੇ ਅੱਗੇ ਦੱਸਿਆ ਕਿ ਇਸ ਮਾਮਲੇ ਵਿੱਚ ਮੁੱਖ ਸ਼ੂਟਰਾਂ ਸਮੇਤ ਹੁਣ ਤੱਕ 6 ਮੁਲਜ਼ਮ ਗ੍ਰਿਫ਼ਤਾਰ ਕੀਤੇ ਜਾ ਚੁੱਕੇ ਹਨ। ਇਹ ਮੁਲਜ਼ਮ ਗੱਡੀਆਂ, ਸ਼ੈਲਟਰ ਅਤੇ ਸੋਸ਼ਲ ਮੀਡੀਆ ਹੈਂਡਲ ਕਰਨ ਵਿੱਚ ਸਹਿਯੋਗ ਦੇ ਰਹੇ ਸਨ। ਪੁਲਸ ਨੇ ਇਸ ਪੂਰੇ ਆਪ੍ਰੇਸ਼ਨ ਦੌਰਾਨ ਮੁਲਜ਼ਮਾਂ ਕੋਲੋਂ 2 ਆਧੁਨਿਕ 'ਜਿਗਿਆਨਾ' ਪਿਸਟਲਾਂ, 2 ਦੇਸੀ ਪਿਸਟਲਾਂ, 10 ਜ਼ਿੰਦਾ ਕਾਰਤੂਸ, 5 ਖੋਲ, 1 ਅਰਟਿਗਾ ਕਾਰ ਅਤੇ ਬਿਨਾਂ ਨੰਬਰ ਪਲੇਟ ਵਾਲਾ ਮੋਟਰਸਾਈਕਲ ਬਰਾਮਦ ਕੀਤਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੱਸਿਆ ਕਿ ਫੜੇ ਗਏ ਗੁਰਵਿੰਦਰ ਸਿੰਘ 'ਤੇ ਪਹਿਲਾਂ ਵੀ 5 ਗੰਭੀਰ ਅਪਰਾਧਿਕ ਮੁਕੱਦਮੇ ਦਰਜ ਹਨ। ਇਹ ਸਾਰੇ ਮੁਲਜ਼ਮ ਸੰਗਰੂਰ ਜ਼ਿਲ੍ਹੇ ਦੇ ਲਹਿਰਾਗਾਗਾ ਦੇ ਆਸ-ਪਾਸ ਦੇ ਪਿੰਡਾਂ ਦੇ ਰਹਿਣ ਵਾਲੇ ਹਨ।
            </p>

            {/* Related Read Box 3 */}
            <div className="my-6 rounded-sm border-l-4 border-primary bg-muted p-4 transition-colors hover:bg-muted/80">
              <span className="text-xs font-black uppercase text-primary tracking-wider block mb-1">
                ਇਹ ਵੀ ਪੜ੍ਹੋ (RELATED NEWS)
              </span>
              <a
                href="https://jagbani.punjabkesari.in/entertainment/news/police-remand-of-mani-shocker-extended-1671869"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-base sm:text-lg"
              >
                ਸਬ-ਇੰਸਪੈਕਟਰ 'ਤੇ ਫਾਈਰਿੰਗ ਕਰਨ ਵਾਲੇ ਮਨੀ ਸ਼ੌਕਰ ਦਾ ਪੁਲਸ ਰਿਮਾਂਡ ਵਧਿਆ; 4 ਹੋਰ ਪਿਸਤੌਲਾਂ ਤੇ ਜ਼ਿੰਦਾ ਰੌਂਦ ਬਰਾਮਦ
                <ExternalLink className="size-4 shrink-0 text-primary" />
              </a>
            </div>

            {/* Police Seizure Box */}
            <div className="my-8 rounded-md bg-ink p-6 text-primary-foreground">
              <h4 className="font-black text-lg text-primary flex items-center gap-2">
                <ShieldAlert className="size-5" /> ਬਰਾਮਦ ਕੀਤੇ ਗਏ ਹਥਿਆਰ ਅਤੇ ਵਾਹਨ
              </h4>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">2</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਆਧੁਨਿਕ 'ਜਿਗਿਆਨਾ' ਪਿਸਟਲਾਂ</div>
                </div>
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">2</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਦੇਸੀ ਪਿਸਟਲਾਂ</div>
                </div>
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">10</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਜ਼ਿੰਦਾ ਕਾਰਤੂਸ</div>
                </div>
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">5</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਖੋਲ</div>
                </div>
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">1</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਅਰਟਿਗਾ ਕਾਰ</div>
                </div>
                <div className="bg-foreground/20 p-3 rounded">
                  <div className="text-2xl font-black text-primary">6</div>
                  <div className="text-xs font-semibold text-primary-foreground/80 mt-1">ਕੁੱਲ ਗ੍ਰਿਫ਼ਤਾਰ ਮੁਲਜ਼ਮ</div>
                </div>
              </div>
            </div>

            {/* Jagbani App Download & WhatsApp Channel Promotion Box */}
            <div className="my-8 rounded-lg border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-foreground flex items-center gap-2">
                    <Smartphone className="size-5 text-primary" />
                    ਜਗ ਬਾਣੀ ਈ-ਪੇਪਰ ਅਤੇ ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    ਪੰਜਾਬ ਅਤੇ ਦੇਸ਼-ਦੁਨੀਆ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਆਪਣੇ ਮੋਬਾਈਲ 'ਤੇ ਪੜ੍ਹਨ ਲਈ ਐਪ ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਵਟਸਐਪ ਚੈਨਲ ਨਾਲ ਜੁੜੋ।
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.jagbani&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-black text-white px-3.5 py-2 text-xs font-bold hover:bg-black/80 transition-colors"
                  >
                    <Download className="size-4" /> For Android
                  </a>
                  <a
                    href="https://itunes.apple.com/in/app/id538323711?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-neutral-800 text-white px-3.5 py-2 text-xs font-bold hover:bg-neutral-700 transition-colors"
                  >
                    <Download className="size-4" /> For iOS
                  </a>
                  <a
                    href="https://whatsapp.com/channel/0029Va94hsaHAdNVur4L170e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white px-3.5 py-2 text-xs font-bold hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle className="size-4" /> For WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Trending Tags Section */}
            <div className="my-8 border-t border-b border-border py-4">
              <div className="flex items-center gap-2 mb-3 text-xs font-black uppercase text-muted-foreground">
                <Tag className="size-3.5" /> ਟ੍ਰੈਂਡਿੰਗ ਟੈਗਸ (Trending Topics)
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://jagbani.punjabkesari.in/trending/news/entertainment/encounter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  #Encounter
                </a>
                <a
                  href="https://jagbani.punjabkesari.in/trending/news/entertainment/shooters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  #shooters
                </a>
                <a
                  href="https://jagbani.punjabkesari.in/trending/news/entertainment/gulab-sidhu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  #Gulab Sidhu
                </a>
                <a
                  href="https://jagbani.punjabkesari.in/trending/news/entertainment/house"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  #house
                </a>
                <a
                  href="https://jagbani.punjabkesari.in/trending/news/entertainment/firing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                >
                  #Firing
                </a>
              </div>
            </div>

            {/* Up Next Card */}
            <div className="my-8 rounded-md border border-border p-4 bg-muted/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase text-primary tracking-wider">
                  ਅਗਲੀ ਖ਼ਬਰ (UP NEXT)
                </span>
                <h4 className="mt-1 font-bold text-foreground text-base sm:text-lg">
                  'ਰਾਈਜ਼ ਐਂਡ ਫਾਲ ਸੀਜ਼ਨ 2' ਤੋਂ ਪਹਿਲਾਂ ਤੇਜ ਪ੍ਰਤਾਪ ਯਾਦਵ ਨੇ ਪਟਨਾ 'ਚ ਕੀਤਾ ਸ਼ਕਤੀ ਪ੍ਰਦਰਸ਼ਨ
                </h4>
              </div>
              <Link
                to="/category/entertainment"
                className="shrink-0 rounded-sm bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                ਪੜ੍ਹੋ &rarr;
              </Link>
            </div>
          </div>

          {/* Social Reactions Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-3">
              <Button
                variant={liked ? "default" : "outline"}
                onClick={handleLike}
                className="gap-2 text-sm"
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                <span>{liked ? "ਪਸੰਦ ਕੀਤਾ" : "ਪਸੰਦ ਕਰੋ"} ({likeCount})</span>
              </Button>
              <Button variant="outline" onClick={copyUrl} className="gap-2 text-sm">
                <Share2 className="size-4" />
                <span>{copied ? "ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ!" : "ਸ਼ੇਅਰ ਕਰੋ"}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => window.print()} className="gap-1 text-xs">
                <Printer className="size-3.5" /> ਪ੍ਰਿੰਟ
              </Button>
            </div>
          </div>

          {/* Related Stories Section */}
          <section className="mt-12">
            <SectionTitle to="/category/entertainment">ਮਨੋਰੰਜਨ ਜਗਤ ਦੀਆਂ ਹੋਰ ਖ਼ਬਰਾਂ</SectionTitle>
            <div className="grid gap-6 sm:grid-cols-2">
              {stories.slice(0, 4).map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        </article>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          <NewsSidebar />
        </aside>
      </div>
    </div>
  );
}
