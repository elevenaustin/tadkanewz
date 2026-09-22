import { createFileRoute, Link } from "@tanstack/react-router";
import { Cookie, Shield, CheckCircle2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openCookieSettingsModal } from "@/components/news/cookie-consent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy (ਕੂਕੀ ਨੀਤੀ) — TadkaNewz" },
      {
        name: "description",
        content: "TadkaNewz ਉੱਤੇ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਅਤੇ ਤੁਹਾਡੀਆਂ ਪਰਦੇਦਾਰੀ ਚੋਣਾਂ ਬਾਰੇ ਵਿਸਥਾਰਤ ਜਾਣਕਾਰੀ।",
      },
      { property: "og:title", content: "Cookie Policy — TadkaNewz" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiePolicyPage,
});

export function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="border-b-4 border-primary pb-6">
        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
          <Cookie className="size-4" /> TADKANEWZ COOKIE TRANSPARENCY
        </div>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-foreground">
          ਕੂਕੀ ਨੀਤੀ (Cookie Policy)
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ਆਖਰੀ ਅਪਡੇਟ: 22 ਸਤੰਬਰ 2026
        </p>
      </div>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-foreground">
        <p>
          ਕੂਕੀਜ਼ ਛੋਟੀਆਂ ਟੈਕਸਟ ਫਾਈਲਾਂ ਹੁੰਦੀਆਂ ਹਨ ਜੋ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਟੋਰ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। TadkaNewz ਵੈੱਬਸਾਈਟ ਨੂੰ ਸੁਰੱਖਿਅਤ ਅਤੇ ਤੇਜ਼ ਰੱਖਣ ਲਈ ਸੀਮਤ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ।
        </p>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-foreground text-base">
              ਆਪਣੀਆਂ ਕੂਕੀ ਤਰਜੀਹਾਂ ਨੂੰ ਕੰਟਰੋਲ ਕਰੋ
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਕਾਰਜਸ਼ੀਲ ਕੂਕੀਜ਼ ਨੂੰ ਚਾਲੂ ਜਾਂ ਬੰਦ ਕਰ ਸਕਦੇ ਹੋ।
            </p>
          </div>
          <Button
            onClick={openCookieSettingsModal}
            className="shrink-0 gap-2 text-xs font-bold bg-primary text-primary-foreground"
          >
            <SlidersHorizontal className="size-4" /> ਕੂਕੀ ਸੈਟਿੰਗਜ਼ ਖੋਲ੍ਹੋ
          </Button>
        </div>

        {/* Cookie Categories Breakdown */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            ਅਸੀਂ ਕਿਹੜੀਆਂ ਕੂਕੀਜ਼ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹਾਂ (Categories of Cookies)
          </h2>

          <div className="space-y-4">
            {/* Category 1 */}
            <div className="rounded-lg border border-border p-5 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Shield className="size-4 text-primary" /> 1. ਜ਼ਰੂਰੀ ਕੂਕੀਜ਼ (Strictly Necessary)
                </h3>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  ਹਮੇਸ਼ਾ ਚਾਲੂ
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ਇਹ ਕੂਕੀਜ਼ ਵੈੱਬਸਾਈਟ ਦੇ ਮੁੱਖ ਕਾਰਜਾਂ, ਸੁਰੱਖਿਆ, ਨੈਵੀਗੇਸ਼ਨ ਅਤੇ ਲੋਡ ਬੈਲੇਂਸਿੰਗ ਲਈ ਲੋੜੀਂਦੀਆਂ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਅਸਮਰੱਥ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।
              </p>
            </div>

            {/* Category 2 */}
            <div className="rounded-lg border border-border p-5 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Cookie className="size-4 text-primary" /> 2. ਵਿਸ਼ਲੇਸ਼ਣ ਕੂਕੀਜ਼ (First-Party Analytics)
                </h3>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                  ਵਿਕਲਪਿਕ (Optional)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ਸਾਨੂੰ ਇਹ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀਆਂ ਹਨ ਕਿ ਪਾਠਕ ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰਦੇ ਹਨ (ਜਿਵੇਂ ਕਿ ਕਿਹੜੀਆਂ ਖ਼ਬਰਾਂ ਵੱਧ ਪੜ੍ਹੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ)। ਇਹ ਪੂਰੀ ਤਰ੍ਹਾਂ ਅਗਿਆਤ ਹੁੰਦੀਆਂ ਹਨ।
              </p>
            </div>

            {/* Category 3 */}
            <div className="rounded-lg border border-border p-5 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" /> 3. ਕਾਰਜਸ਼ੀਲ ਤਰਜੀਹਾਂ (Functional Cookies)
                </h3>
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                  ਵਿਕਲਪਿਕ (Optional)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                ਤੁਹਾਡੀਆਂ ਨਿੱਜੀ ਤਰਜੀਹਾਂ ਜਿਵੇਂ ਕਿ ਫੌਂਟ ਦਾ ਆਕਾਰ, ਬੁੱਕਮਾਰਕ ਕੀਤੀਆਂ ਖ਼ਬਰਾਂ ਅਤੇ ਡਾਰਕ/ਲਾਈਟ ਮੋਡ ਨੂੰ ਯਾਦ ਰੱਖਣ ਲਈ ਵਰਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}