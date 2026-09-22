import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, Eye, Cookie, MapPin, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCookieSettingsModal } from "@/components/news/cookie-consent";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy (ਪਰਦੇਦਾਰੀ ਨੀਤੀ) — TadkaNewz" },
      {
        name: "description",
        content:
          "TadkaNewz ਦੀ ਪਰਦੇਦਾਰੀ ਨੀਤੀ: ਅਸੀਂ ਪਾਠਕਾਂ ਦੇ ਅਧਿਕਾਰਾਂ, ਕੂਕੀਜ਼ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਪਹਿਲੀ-ਧਿਰ ਵਿਸ਼ਲੇਸ਼ਣ ਬਾਰੇ ਪੂਰੀ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਾਂ।",
      },
      { property: "og:title", content: "Privacy Policy — TadkaNewz" },
      {
        property: "og:description",
        content: "ਪਾਠਕਾਂ ਦੀ ਪਰਦੇਦਾਰੀ ਸਾਡੀ ਪਹਿਲ ਹੈ। ਸਾਡੀ ਪਾਰਦਰਸ਼ੀ ਨੀਤੀ ਪੜ੍ਹੋ।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="border-b-4 border-primary pb-6">
        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
          <ShieldCheck className="size-4" /> TADKANEWZ PRIVACY & TRUST
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-foreground">
          ਪਰਦੇਦਾਰੀ ਨੀਤੀ (Privacy Policy)
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ਆਖਰੀ ਅਪਡੇਟ: 22 ਸਤੰਬਰ 2026 • Last updated: September 22, 2026
        </p>
      </div>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-foreground">
        {/* Intro */}
        <section className="rounded-lg bg-muted/40 p-5 border border-border">
          <p className="font-medium">
            TadkaNewz ਪਾਠਕਾਂ ਦੀ ਪਰਦੇਦਾਰੀ ਦਾ ਪੂਰਨ ਸਤਿਕਾਰ ਕਰਦਾ ਹੈ। ਅਸੀਂ ਕਿਸੇ ਵੀ ਗੁਪਤ ਟਰੈਕਿੰਗ, ਫਿੰਗਰਪ੍ਰਿੰਟਿੰਗ ਜਾਂ ਨਿੱਜੀ ਡਾਟਾ ਵੇਚਣ ਵਿੱਚ ਵਿਸ਼ਵਾਸ ਨਹੀਂ ਰੱਖਦੇ। ਇਹ ਦਸਤਾਵੇਜ਼ ਦੱਸਦਾ ਹੈ ਕਿ ਅਸੀਂ ਕਿਹੜੀ ਸੀਮਤ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ, ਕਿਉਂ ਕਰਦੇ ਹਾਂ ਅਤੇ ਤੁਹਾਡੇ ਕੋਲ ਇਸ ਉੱਤੇ ਕੀ ਨਿਯੰਤਰਣ ਹੈ।
          </p>
        </section>

        {/* Section 1: What we collect */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <Eye className="size-5 text-primary" /> 1. ਅਸੀਂ ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਇਕੱਠੀ ਕਰਦੇ ਹਾਂ (What Information We Collect)
          </h2>
          <p>
            ਜਦੋਂ ਤੁਸੀਂ ਸਾਡੀ ਵੈੱਬਸਾਈਟ 'ਤੇ ਆਉਂਦੇ ਹੋ, ਤਾਂ ਤੁਹਾਡੀ ਸਹਿਮਤੀ (Consent) ਦੇ ਆਧਾਰ 'ਤੇ ਸਿਰਫ਼ ਹੇਠ ਲਿਖੀ ਅਗਿਆਤ ਤਕਨੀਕੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕੀਤੀ ਜਾਂਦੀ ਹੈ:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-foreground/90">
            <li><strong>ਅਗਿਆਤ ਸੈਸ਼ਨ ਆਈਡੀ (Anonymous Session ID):</strong> ਹਰੇਕ ਵਿਜ਼ਿਟਰ ਲਈ ਇੱਕ ਬੇਤਰਤੀਬ ਅਸਥਾਈ ਪਛਾਣਕਰਤਾ।</li>
            <li><strong>ਪੜ੍ਹੀਆਂ ਗਈਆਂ ਖ਼ਬਰਾਂ (Pages Viewed):</strong> ਕਿਹੜੇ ਪੰਨੇ ਅਤੇ ਲੇਖ ਵੇਖੇ ਗਏ।</li>
            <li><strong>ਸਮਾਂ ਅਤੇ ਮਿਤੀ (Timestamps):</strong> ਵਿਜ਼ਿਟ ਦਾ ਸਮਾਂ।</li>
            <li><strong>ਡਿਵਾਈਸ ਅਤੇ ਬ੍ਰਾਊਜ਼ਰ ਦੀ ਕਿਸਮ (Device & Browser):</strong> ਮੋਬਾਈਲ, ਡੈਸਕਟੌਪ ਜਾਂ ਟੈਬਲੇਟ (ਤਾਂ ਜੋ ਅਸੀਂ ਸਕ੍ਰੀਨ ਦੇ ਮੁਤਾਬਕ ਡਿਜ਼ਾਈਨ ਨੂੰ ਅਨੁਕੂਲ ਬਣਾ ਸਕੀਏ)।</li>
            <li><strong>ਭਾਸ਼ਾ ਅਤੇ ਸਮਾਂ ਖੇਤਰ (Language & Timezone):</strong> ਬ੍ਰਾਊਜ਼ਰ ਦੀ ਭਾਸ਼ਾ ਤਰਜੀਹ।</li>
            <li><strong>ਅੰਦਾਜ਼ਨ ਖੇਤਰ (Approximate Region):</strong> ਟਾਈਮ-ਜ਼ੋਨ ਦੇ ਆਧਾਰ 'ਤੇ ਆਮ ਖੇਤਰ (ਜਿਵੇਂ ਕਿ ਪੰਜਾਬ/ਭਾਰਤ ਜਾਂ ਕੈਨੇਡਾ)। ਅਸੀਂ ਤੁਹਾਡਾ ਸਹੀ ਪਤਾ ਜਾਂ GPS ਟਰੈਕ ਨਹੀਂ ਕਰਦੇ।</li>
          </ul>
        </section>

        {/* Section 2: Cookies & Consent */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <Cookie className="size-5 text-primary" /> 2. ਕੂਕੀਜ਼ ਅਤੇ ਸਹਿਮਤੀ (Cookies & Consent)
          </h2>
          <p>
            ਅਸੀਂ ਵੈੱਬਸਾਈਟ ਦੇ ਸੰਚਾਲਨ ਲਈ ਜ਼ਰੂਰੀ ਕੂਕੀਜ਼ ਅਤੇ ਤੁਹਾਡੀ ਇਜਾਜ਼ਤ ਨਾਲ ਵਿਸ਼ਲੇਸ਼ਣ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਾਂ। ਜੇਕਰ ਤੁਸੀਂ ਵਿਸ਼ਲੇਸ਼ਣ ਕੂਕੀਜ਼ ਨੂੰ ਰੱਦ ਕਰਦੇ ਹੋ, ਤਾਂ ਵੀ ਵੈੱਬਸਾਈਟ ਪੂਰੀ ਤਰ੍ਹਾਂ ਕੰਮ ਕਰਦੀ ਰਹੇਗੀ।
          </p>
          <div className="pt-2">
            <Button
              onClick={openCookieSettingsModal}
              variant="outline"
              className="gap-2 font-bold text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Cookie className="size-4" /> ਕੂਕੀ ਤਰਜੀਹਾਂ ਬਦਲੋ (Change Cookie Preferences)
            </Button>
          </div>
        </section>

        {/* Section 3: Optional Location */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <MapPin className="size-5 text-primary" /> 3. ਵਿਕਲਪਿਕ ਸਥਾਨ ਪਹੁੰਚ (Optional Location Access)
          </h2>
          <p>
            ਅਸੀਂ ਕਦੇ ਵੀ ਆਪਣੇ-ਆਪ ਤੁਹਾਡਾ ਸਥਾਨ (Location) ਨਹੀਂ ਮੰਗਦੇ। ਜੇਕਰ ਤੁਸੀਂ ਖੇਤਰੀ ਜਾਂ ਜ਼ਿਲ੍ਹਾ-ਵਾਰ ਖ਼ਬਰਾਂ (ਜਿਵੇਂ ਕਿ ਬਰਨਾਲਾ, ਲੁਧਿਆਣਾ, ਅੰਮ੍ਰਿਤਸਰ) ਵੇਖਣ ਲਈ ਖ਼ੁਦ "Enable Location" 'ਤੇ ਕਲਿੱਕ ਕਰਦੇ ਹੋ, ਤਾਂ ਹੀ ਬ੍ਰਾਊਜ਼ਰ ਤੋਂ ਸਹਿਮਤੀ ਮੰਗੀ ਜਾਂਦੀ ਹੈ। ਇਨਕਾਰ ਕਰਨ 'ਤੇ ਵੈੱਬਸਾਈਟ ਆਮ ਵਾਂਗ ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ।
          </p>
        </section>

        {/* Section 4: Data Retention */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <Trash2 className="size-5 text-primary" /> 4. ਡਾਟਾ ਰਿਟੈਂਸ਼ਨ ਅਤੇ ਮਿਟਾਉਣਾ (Data Retention & Deletion)
          </h2>
          <p>
            ਅਸੀਂ ਵਿਜ਼ਿਟਰਾਂ ਦਾ ਡਾਟਾ ਸਦਾ ਲਈ ਸਟੋਰ ਨਹੀਂ ਕਰਦੇ। ਸਾਡੀ ਸਿਸਟਮ ਨੀਤੀ ਅਨੁਸਾਰ ਐਨਾਲਿਟਿਕਸ ਡਾਟਾ 30 ਤੋਂ 90 ਦਿਨਾਂ ਬਾਅਦ ਆਪਣੇ-ਆਪ ਛਾਂਟਿਆ ਜਾਂ ਮਿਟਾਇਆ ਜਾਂਦਾ ਹੈ।
          </p>
        </section>

        {/* Section 5: Contact */}
        <section className="rounded-lg border border-border p-5 bg-card">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2 mb-2">
            <Mail className="size-4.5 text-primary" /> ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ (Contact Us)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ਜੇਕਰ ਤੁਹਾਡੇ ਕੋਲ ਪਰਦੇਦਾਰੀ ਨੀਤੀ ਸੰਬੰਧੀ ਕੋਈ ਸਵਾਲ ਹਨ ਜਾਂ ਤੁਸੀਂ ਡਾਟਾ ਮਿਟਾਉਣ ਦੀ ਬੇਨਤੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ, ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ:
          </p>
          <div className="mt-3 text-sm font-semibold text-foreground">
            ਈਮੇਲ: <a href="mailto:privacy@tadkanewz.com" className="text-primary hover:underline">privacy@tadkanewz.com</a>
          </div>
        </section>
      </div>
    </div>
  );
}