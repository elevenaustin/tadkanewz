import { useState, useEffect } from "react";
import {
  BellRing,
  MapPin,
  X,
  CheckCircle2,
  Navigation,
  Globe,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSessionLocation } from "@/lib/analytics";

const PROMPT_STORAGE_KEY = "tadkanewz_onboarding_prompt_v2";

const PUNJAB_DISTRICTS = [
  "ਬਰਨਾਲਾ (Barnala)",
  "ਲੁਧਿਆਣਾ (Ludhiana)",
  "ਅੰਮ੍ਰਿਤਸਰ (Amritsar)",
  "ਜਲੰਧਰ (Jalandhar)",
  "ਪਟਿਆਲਾ (Patiala)",
  "ਬਠਿੰਡਾ (Bathinda)",
  "ਮੋਹਾਲੀ / ਚੰਡੀਗੜ੍ਹ (SAS Nagar / Tricity)",
  "ਸੰਗਰੂਰ (Sangrur)",
  "ਹੁਸ਼ਿਆਰਪੁਰ (Hoshiarpur)",
  "ਮੋਗਾ (Moga)",
  "ਗੁਰਦਾਸਪੁਰ (Gurdaspur)",
  "ਫ਼ਿਰੋਜ਼ਪੁਰ (Ferozepur)",
  "ਮਾਨਸਾ (Mansa)",
  "ਕਪੂਰਥਲਾ (Kapurthala)",
  "ਮੁਕਤਸਰ ਸਾਹਿਬ (Sri Muktsar Sahib)",
  "ਫਤਿਹਗੜ੍ਹ ਸਾਹਿਬ (Fatehgarh Sahib)",
  "ਰੂਪਨਗਰ (Rupnagar)",
  "ਤਰਨ ਤਾਰਨ (Tarn Taran)",
  "ਫਾਜ਼ਿਲਕਾ (Fazilka)",
  "ਪਠਾਨਕੋਟ (Pathankot)",
  "ਮਲੇਰਕੋਟਲਾ (Malerkotla)",
  "ਕੈਨੇਡਾ / NRI ਡਾਇਸਪੋਰਾ (Canada)",
  "ਯੂ.ਕੇ. / NRI ਡਾਇਸਪੋਰਾ (UK)",
  "ਅਮਰੀਕਾ / NRI ਡਾਇਸਪੋਰਾ (USA)",
  "ਆਸਟ੍ਰੇਲੀਆ / ਨਿਊਜ਼ੀਲੈਂਡ (Australia / NZ)",
];

export function LocalNewsPrompt() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<"updates" | "location">("updates");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showManualDropdown, setShowManualDropdown] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    // Check if user has already completed or dismissed onboarding
    if (typeof window === "undefined") return;
    const answered = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (!answered) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const notifyComplete = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tadkanewz_local_prompt_completed"));
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_STORAGE_KEY, "dismissed");
    setShow(false);
    notifyComplete();
  };

  // Step 1: User answers Daily Punjabi Updates (Yes or No)
  const handleUpdatesAnswer = async (interested: boolean) => {
    localStorage.setItem(
      "tadkanewz_daily_updates_interest",
      interested ? "yes" : "no"
    );

    // If user clicked Yes, optionally request browser notification permission
    if (interested && "Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {}
    }

    // Immediately advance to Step 2: Location / Area Setup
    setStep("location");
  };

  // Step 2: Location via GPS
  const handleEnableGps = () => {
    if (!("geolocation" in navigator)) {
      setShowManualDropdown(true);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const coordsStr = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;

        // Approximate Punjab district detection
        let detectedDistrict = "ਪੰਜਾਬ ਖੇਤਰ (Punjab Regional Feed)";
        if (lat >= 30.2 && lat <= 30.5 && lng >= 75.4 && lng <= 75.7) {
          detectedDistrict = "ਬਰਨਾਲਾ ਖੇਤਰ (Barnala District)";
        } else if (lat >= 30.8 && lat <= 31.0 && lng >= 75.7 && lng <= 76.0) {
          detectedDistrict = "ਲੁਧਿਆਣਾ ਖੇਤਰ (Ludhiana District)";
        } else if (lat >= 31.5 && lat <= 31.8 && lng >= 74.7 && lng <= 75.0) {
          detectedDistrict = "ਅੰਮ੍ਰਿਤਸਰ ਖੇਤਰ (Amritsar District)";
        } else if (lat >= 31.2 && lat <= 31.5 && lng >= 75.5 && lng <= 75.8) {
          detectedDistrict = "ਜਲੰਧਰ ਖੇਤਰ (Jalandhar District)";
        } else if (lat >= 30.6 && lat <= 30.9 && lng >= 76.6 && lng <= 76.9) {
          detectedDistrict = "ਚੰਡੀਗੜ੍ਹ / ਮੋਹਾਲੀ (Tricity)";
        }

        updateSessionLocation(detectedDistrict, coordsStr);
        localStorage.setItem(PROMPT_STORAGE_KEY, detectedDistrict);
        setStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${detectedDistrict} ਸਫਲਤਾਪੂਰਵਕ ਸੈੱਟ ਹੋ ਗਿਆ!`);

        setTimeout(() => {
          setShow(false);
          notifyComplete();
        }, 1200);
      },
      (error) => {
        setLoading(false);
        // Fallback to manual selection if GPS permission is denied or timed out
        setShowManualDropdown(true);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Step 2: Manual District selection
  const handleManualSelect = (district: string) => {
    if (!district) return;
    setSelectedDistrict(district);
    updateSessionLocation(district);
    localStorage.setItem(PROMPT_STORAGE_KEY, district);
    setStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${district} ਸੈੱਟ ਹੋ ਗਿਆ!`);

    setTimeout(() => {
      setShow(false);
      notifyComplete();
    }, 1200);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Central Attractive Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-2xl text-card-foreground animate-in zoom-in-95 duration-200">
        {/* Top vibrant accent gradient line */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

        {/* Top bar with Step Counter and Close button */}
        <div className="flex items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 border border-red-600/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-red-600">
              <Sparkles className="size-3 fill-current" />
              {step === "updates" ? "ਕਦਮ 1 / 2" : "ਕਦਮ 2 / 2"}
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {step === "updates" ? "ਪੰਜਾਬੀ ਅੱਪਡੇਟ" : "ਆਪਣਾ ਇਲਾਕਾ"}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="ਬੰਦ ਕਰੋ"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: step === "updates" ? "50%" : "100%" }}
          />
        </div>

        {/* Success Status View */}
        {statusMsg ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in">
            <div className="grid size-14 place-items-center rounded-full bg-green-500/10 text-green-600 border border-green-500/30">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-lg font-black text-foreground">{statusMsg}</h3>
            <p className="text-xs text-muted-foreground">
              ਤੁਹਾਡੇ ਲਈ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...
            </p>
          </div>
        ) : (
          <>
            {/* STEP 1: Daily Punjabi Updates (Yes / No) */}
            {step === "updates" && (
              <div className="pt-4 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-600/10 text-red-600 border border-red-600/20 shadow-inner">
                    <BellRing className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black leading-tight text-foreground">
                      ਕੀ ਤੁਸੀਂ ਰੋਜ਼ਾਨਾ ਪੰਜਾਬੀ ਅੱਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      ਪੰਜਾਬ, ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ, ਖੇਡਾਂ ਅਤੇ ਮਨੋਰੰਜਨ ਦੇ ਮੁੱਖ ਸਮਾਚਾਰ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣੋ।
                    </p>
                  </div>
                </div>

                {/* Engaging Yes / No Choice Cards */}
                <div className="grid gap-2.5 pt-2">
                  <Button
                    size="lg"
                    onClick={() => handleUpdatesAnswer(true)}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm justify-between shadow-md group transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Check className="size-4.5 group-hover:scale-110 transition-transform" />
                      ਹਾਂ, ਮੈਨੂੰ ਅੱਪਡੇਟ ਚਾਹੀਦੇ ਹਨ (Yes)
                    </span>
                    <ChevronRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => handleUpdatesAnswer(false)}
                    className="w-full h-11 border-border font-bold text-xs text-muted-foreground hover:text-foreground justify-between hover:bg-muted/50"
                  >
                    <span>ਨਹੀਂ, ਧੰਨਵਾਦ (No, thanks)</span>
                    <span className="text-[10px] text-muted-foreground/60">ਅਗਲਾ ਕਦਮ</span>
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Setup Your Area / Location Permission */}
            {step === "location" && (
              <div className="pt-4 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black leading-tight text-foreground">
                      ਆਪਣਾ ਇਲਾਕਾ ਸੈੱਟ ਕਰੋ (Setup Your Area)
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ ਅਤੇ ਨੇੜਲੇ ਸ਼ਹਿਰ ਦੀਆਂ ਸਥਾਨਕ ਖ਼ਬਰਾਂ ਵੇਖਣ ਲਈ ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ ਜਾਂ ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ।
                    </p>
                  </div>
                </div>

                {showManualDropdown ? (
                  /* Manual District Dropdown view */
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-foreground block">
                      ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ (Select District):
                    </label>
                    <select
                      className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-600"
                      onChange={(e) => handleManualSelect(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਖੇਤਰ ਚੁਣੋ...
                      </option>
                      {PUNJAB_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setShowManualDropdown(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="size-3" /> ਵਾਪਸ ਜਾਓ
                      </button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="text-xs text-muted-foreground"
                      >
                        ਬਾਅਦ ਵਿੱਚ (Skip)
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Location Permission Actions */
                  <div className="grid gap-2.5 pt-2">
                    <Button
                      size="lg"
                      onClick={handleEnableGps}
                      disabled={loading}
                      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm justify-between shadow-md group transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Navigation className="size-4.5 group-hover:rotate-45 transition-transform" />
                        {loading
                          ? "ਲੋਕੇਸ਼ਨ ਚੁਣੀ ਜਾ ਰਹੀ ਹੈ..."
                          : "ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ (Allow Location)"}
                      </span>
                      <ChevronRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowManualDropdown(true)}
                        className="flex-1 h-10 border-border text-xs font-bold hover:bg-muted/50"
                      >
                        <Globe className="size-3.5 mr-1.5" />
                        ਜ਼ਿਲ੍ਹਾ ਖ਼ੁਦ ਚੁਣੋ
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="h-10 text-xs text-muted-foreground hover:text-foreground"
                      >
                        ਬਾਅਦ ਵਿੱਚ (Skip)
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

