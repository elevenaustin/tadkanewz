import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Cookie,
  ShieldCheck,
  SlidersHorizontal,
  X,
  Check,
  Globe,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getConsentPreferences,
  saveConsentPreferences,
  type ConsentPreferences,
} from "@/lib/consent";

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [functionalConsent, setFunctionalConsent] = useState(false);
  const [lang, setLang] = useState<"pa" | "en">("pa");

  useEffect(() => {
    setMounted(true);
    const current = getConsentPreferences();
    setAnalyticsConsent(current.analytics);
    setFunctionalConsent(current.functional);

    // Location prompt should appear FIRST.
    // If the location prompt has not been answered yet, wait for user interaction with it.
    const isLocationPromptAnswered =
      typeof window !== "undefined" &&
      !!(
        localStorage.getItem("tadkanewz_location_prompt_v1") ||
        localStorage.getItem("tadkanewz_notif_prompt_v1") ||
        localStorage.getItem("tadkanewz_onboarding_prompt_v2") ||
        localStorage.getItem("tadkanewz_local_news_prompt_v1")
      );

    if (current.status === "pending") {
      if (isLocationPromptAnswered) {
        setShowBanner(true);
      } else {
        // Wait for location prompt to complete first
        const handleLocationCompleted = () => {
          setTimeout(() => {
            const prefs = getConsentPreferences();
            if (prefs.status === "pending") {
              setShowBanner(true);
            }
          }, 350);
        };
        window.addEventListener("tadkanewz_local_prompt_completed", handleLocationCompleted);

        // Fallback: If no interaction after 15 seconds, show cookie banner
        const fallbackTimer = setTimeout(() => {
          const prefs = getConsentPreferences();
          if (prefs.status === "pending") {
            setShowBanner(true);
          }
        }, 15000);

        return () => {
          window.removeEventListener("tadkanewz_local_prompt_completed", handleLocationCompleted);
          clearTimeout(fallbackTimer);
        };
      }
    }

    const handleOpenSettings = () => {
      const prefs = getConsentPreferences();
      setAnalyticsConsent(prefs.analytics);
      setFunctionalConsent(prefs.functional);
      setShowSettingsModal(true);
    };

    window.addEventListener("tadkanewz_open_cookie_settings", handleOpenSettings);
    return () => {
      window.removeEventListener("tadkanewz_open_cookie_settings", handleOpenSettings);
    };
  }, []);

  if (!mounted) return null;

  const handleAcceptAll = () => {
    saveConsentPreferences({
      analytics: true,
      functional: true,
      status: "all",
    });
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    saveConsentPreferences({
      analytics: false,
      functional: false,
      status: "essential_only",
    });
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    saveConsentPreferences({
      analytics: analyticsConsent,
      functional: functionalConsent,
      status: "custom",
    });
    setShowSettingsModal(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* Bottom Floating Consent Banner */}
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5 animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto max-w-5xl rounded-lg border-2 border-primary/30 bg-background/98 p-5 sm:p-6 shadow-2xl backdrop-blur-md dark:bg-card/98">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <Cookie className="size-4.5" />
                    </div>
                    <h3 className="font-black text-foreground text-base sm:text-lg">
                      {lang === "pa"
                        ? "ਤੁਹਾਡੀ ਪਰਦੇਦਾਰੀ ਸਾਡੇ ਲਈ ਅਹਿਮ ਹੈ (Your Privacy Matters)"
                        : "Your Privacy Matters"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setLang(lang === "pa" ? "en" : "pa")}
                    className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="size-3.5" /> {lang === "pa" ? "English" : "ਪੰਜਾਬੀ"}
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {lang === "pa" ? (
                    <>
                      TadkaNewz ਵੈੱਬਸਾਈਟ ਦੇ ਸੁਚਾਰੂ ਸੰਚਾਲਨ, ਪਾਠਕਾਂ ਦੀਆਂ ਤਰਜੀਹਾਂ ਯਾਦ ਰੱਖਣ ਅਤੇ
                      ਸਮੁੱਚੇ ਟਰੈਫ਼ਿਕ ਰੁਝਾਨਾਂ ਨੂੰ ਸਮਝਣ ਲਈ ਕੂਕੀਜ਼ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਪਹਿਲੀ-ਧਿਰ ਵਿਸ਼ਲੇਸ਼ਣ
                      (Analytics) ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ। ਅਸੀਂ ਤੁਹਾਡੀ ਨਿੱਜੀ ਪਰਦੇਦਾਰੀ ਦਾ ਪੂਰਾ ਸਤਿਕਾਰ
                      ਕਰਦੇ ਹਾਂ। ਹੋਰ ਜਾਣਕਾਰੀ ਲਈ ਸਾਡੀ{" "}
                      <Link
                        to="/privacy"
                        className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        ਪਰਦੇਦਾਰੀ ਨੀਤੀ (Privacy Policy)
                      </Link>{" "}
                      ਅਤੇ{" "}
                      <Link
                        to="/cookies"
                        className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        ਕੂਕੀ ਨੀਤੀ
                      </Link>{" "}
                      ਵੇਖੋ।
                    </>
                  ) : (
                    <>
                      TadkaNewz uses strictly necessary cookies to operate the site and optional
                      first-party analytics to understand website readership trends. We never track
                      personal sensitive information or sell data. Learn more in our{" "}
                      <Link
                        to="/privacy"
                        className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/cookies"
                        className="font-bold text-primary underline underline-offset-2 hover:opacity-80"
                      >
                        Cookie Policy
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettingsModal(true)}
                  className="text-xs gap-1.5 h-9"
                >
                  <SlidersHorizontal className="size-3.5" />
                  {lang === "pa" ? "ਕੂਕੀ ਸੈਟਿੰਗਜ਼" : "Cookie Settings"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectOptional}
                  className="text-xs h-9"
                >
                  {lang === "pa" ? "ਸਿਰਫ਼ ਜ਼ਰੂਰੀ (Reject Optional)" : "Reject Optional"}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="text-xs font-bold gap-1.5 h-9 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Check className="size-4" />
                  {lang === "pa" ? "ਸਭ ਸਵੀਕਾਰ ਕਰੋ (Accept All)" : "Accept All"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black">
              <ShieldCheck className="size-5 text-primary" />
              ਕੂਕੀ ਅਤੇ ਪਰਦੇਦਾਰੀ ਤਰਜੀਹਾਂ (Cookie Preferences)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              ਆਪਣੀ ਪਸੰਦ ਅਨੁਸਾਰ ਕੂਕੀ ਸ਼੍ਰੇਣੀਆਂ ਚੁਣੋ। ਜ਼ਰੂਰੀ ਕੂਕੀਜ਼ ਤੋਂ ਬਿਨਾਂ ਵੈੱਬਸਾਈਟ ਕੰਮ ਨਹੀਂ ਕਰ
              ਸਕਦੀ।
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Category 1: Essential */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5 bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    ਜ਼ਰੂਰੀ ਕੂਕੀਜ਼ (Essential Cookies)
                  </span>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    ਹਮੇਸ਼ਾ ਚਾਲੂ (Always Active)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ਸੁਰੱਖਿਆ, ਨੈਵੀਗੇਸ਼ਨ ਅਤੇ ਵੈੱਬਸਾਈਟ ਦੇ ਮੁੱਖ ਕਾਰਜਾਂ ਲਈ ਲੋੜੀਂਦੀਆਂ ਹਨ।
                </p>
              </div>
              <Switch checked={true} disabled className="mt-1" />
            </div>

            {/* Category 2: Analytics */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5">
              <div className="space-y-1">
                <span className="font-bold text-sm text-foreground">
                  ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਪ੍ਰਦਰਸ਼ਨ (Analytics & Performance)
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ਸਾਨੂੰ ਇਹ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ ਕਿ ਪਾਠਕ ਕਿਹੜੀਆਂ ਖ਼ਬਰਾਂ ਪੜ੍ਹ ਰਹੇ ਹਨ ਤਾਂ ਜੋ ਅਸੀਂ
                  ਸਮੱਗਰੀ ਵਿੱਚ ਸੁਧਾਰ ਕਰ ਸਕੀਏ। ਇਹ ਪੂਰੀ ਤਰ੍ਹਾਂ ਅਗਿਆਤ (Anonymous) ਹੈ।
                </p>
              </div>
              <Switch
                checked={analyticsConsent}
                onCheckedChange={setAnalyticsConsent}
                className="mt-1"
              />
            </div>

            {/* Category 3: Functional */}
            <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5">
              <div className="space-y-1">
                <span className="font-bold text-sm text-foreground">
                  ਕਾਰਜਸ਼ੀਲ ਤਰਜੀਹਾਂ (Functional / Preferences)
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ਤੁਹਾਡੀਆਂ ਤਰਜੀਹਾਂ (ਜਿਵੇਂ ਕਿ ਫੌਂਟ ਸਾਈਜ਼ ਅਤੇ ਸੇਵ ਕੀਤੀਆਂ ਖ਼ਬਰਾਂ) ਨੂੰ ਯਾਦ ਰੱਖਣ ਵਿੱਚ
                  ਸਹਾਇਤਾ ਕਰਦਾ ਹੈ।
                </p>
              </div>
              <Switch
                checked={functionalConsent}
                onCheckedChange={setFunctionalConsent}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectOptional}
              className="text-xs"
            >
              ਸਿਰਫ਼ ਜ਼ਰੂਰੀ
            </Button>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveCustom}
                className="text-xs font-bold bg-primary text-primary-foreground"
              >
                ਪਸੰਦ ਸੇਵ ਕਰੋ (Save Preferences)
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function openCookieSettingsModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("tadkanewz_open_cookie_settings"));
  }
}
