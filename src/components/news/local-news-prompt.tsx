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

const NOTIF_PROMPT_KEY = "tadkanewz_notif_prompt_v1";
const LOCATION_PROMPT_KEY = "tadkanewz_location_prompt_v1";

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
  // Notification prompt state (shown on initial site open)
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);

  // Location / Area prompt state (shown after 10 seconds)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. First notification popup on site open (500ms delay for smooth entrance)
    const notifAnswered = localStorage.getItem(NOTIF_PROMPT_KEY);
    if (!notifAnswered) {
      const notifTimer = setTimeout(() => {
        setShowNotifPrompt(true);
      }, 500);
      return () => clearTimeout(notifTimer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 2. Select Location popup appears exactly 10 seconds after opening the site
    const locationAnswered = localStorage.getItem(LOCATION_PROMPT_KEY);
    if (!locationAnswered) {
      const locationTimer = setTimeout(() => {
        // If notification modal is still open, close it to let location modal take focus
        setShowNotifPrompt(false);
        setShowLocationPrompt(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(locationTimer);
    }
  }, []);

  const notifyComplete = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("tadkanewz_local_prompt_completed"));
    }
  };

  // Notification handlers
  const handleEnableNotifications = async () => {
    localStorage.setItem(NOTIF_PROMPT_KEY, "enabled");
    if ("Notification" in window && Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {}
    }
    setShowNotifPrompt(false);
  };

  const handleDismissNotifications = () => {
    localStorage.setItem(NOTIF_PROMPT_KEY, "dismissed");
    setShowNotifPrompt(false);
  };

  // Location handlers
  const handleDismissLocation = () => {
    localStorage.setItem(LOCATION_PROMPT_KEY, "dismissed");
    setShowLocationPrompt(false);
    notifyComplete();
  };

  // User clicks the single "Choose Your Area" button
  const handleChooseAreaClick = () => {
    if (!("geolocation" in navigator)) {
      setShowDistrictDropdown(true);
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoadingLocation(false);
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
        localStorage.setItem(LOCATION_PROMPT_KEY, detectedDistrict);
        setLocationStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${detectedDistrict} ਸਫਲਤਾਪੂਰਵਕ ਸੈੱਟ ਹੋ ਗਿਆ!`);

        setTimeout(() => {
          setShowLocationPrompt(false);
          notifyComplete();
        }, 1200);
      },
      (error) => {
        setLoadingLocation(false);
        // If GPS is declined or timed out, display the district dropdown list
        setShowDistrictDropdown(true);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  // Manual District selection
  const handleSelectDistrict = (district: string) => {
    if (!district) return;
    updateSessionLocation(district);
    localStorage.setItem(LOCATION_PROMPT_KEY, district);
    setLocationStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${district} ਸੈੱਟ ਹੋ ਗਿਆ!`);

    setTimeout(() => {
      setShowLocationPrompt(false);
      notifyComplete();
    }, 1200);
  };

  return (
    <>
      {/* 1. INITIAL NOTIFICATION POPUP (Upon Opening the Site) */}
      {showNotifPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-2xl text-card-foreground animate-in zoom-in-95 duration-200">
            {/* Top red accent line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

            {/* Header row */}
            <div className="flex items-center justify-between pb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 border border-red-600/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-red-600">
                <Sparkles className="size-3 fill-current" />
                ਨੋਟੀਫਿਕੇਸ਼ਨ ਅੱਪਡੇਟ
              </span>
              <button
                onClick={handleDismissNotifications}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="ਬੰਦ ਕਰੋ"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="pt-3 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-red-600/10 text-red-600 border border-red-600/20 shadow-inner">
                  <BellRing className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black leading-tight text-foreground">
                    ਨੋਟੀਫਿਕੇਸ਼ਨ ਚਾਲੂ ਕਰੋ (Turn on Notifications)
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    ਪੰਜਾਬ, ਦੇਸ਼-ਵਿਦੇਸ਼ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਅਤੇ ਲਾਈਵ ਅੱਪਡੇਟ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਫੋਨ ਜਾਂ ਕੰਪਿਊਟਰ 'ਤੇ ਪ੍ਰਾਪਤ ਕਰੋ।
                  </p>
                </div>
              </div>

              <div className="grid gap-2.5 pt-2">
                <Button
                  size="lg"
                  onClick={handleEnableNotifications}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm justify-between shadow-md group transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Check className="size-4.5 group-hover:scale-110 transition-transform" />
                    ਨੋਟੀਫਿਕੇਸ਼ਨ ਚਾਲੂ ਕਰੋ (Turn on Notifications)
                  </span>
                  <ChevronRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismissNotifications}
                  className="w-full h-9 text-xs text-muted-foreground hover:text-foreground"
                >
                  ਬਾਅਦ ਵਿੱਚ (Not Now)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SELECT LOCATION POPUP (Appears After 10 Seconds of Opening the Site) */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-2xl text-card-foreground animate-in zoom-in-95 duration-200">
            {/* Top amber/red accent line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-red-600 to-amber-500" />

            {/* Header row */}
            <div className="flex items-center justify-between pb-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-600">
                <MapPin className="size-3" />
                ਸਥਾਨਕ ਖ਼ਬਰਾਂ (Local News)
              </span>
              <button
                onClick={handleDismissLocation}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="ਬੰਦ ਕਰੋ"
              >
                <X className="size-4" />
              </button>
            </div>

            {locationStatusMsg ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in">
                <div className="grid size-14 place-items-center rounded-full bg-green-500/10 text-green-600 border border-green-500/30">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-lg font-black text-foreground">{locationStatusMsg}</h3>
                <p className="text-xs text-muted-foreground">
                  ਤੁਹਾਡੇ ਇਲਾਕੇ ਦੀਆਂ ਖ਼ਬਰਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...
                </p>
              </div>
            ) : (
              <div className="pt-3 space-y-4 animate-in fade-in">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
                    <Navigation className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black leading-tight text-foreground">
                      ਆਪਣਾ ਇਲਾਕਾ ਚੁਣੋ (Choose Your Area)
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ ਅਤੇ ਨੇੜਲੇ ਸ਼ਹਿਰ ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਵੇਖਣ ਲਈ ਆਪਣਾ ਇਲਾਕਾ ਸੈੱਟ ਕਰੋ।
                    </p>
                  </div>
                </div>

                {showDistrictDropdown ? (
                  /* Manual District selection fallback */
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-foreground block">
                      ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ (Select District):
                    </label>
                    <select
                      className="w-full h-11 rounded-lg border border-input bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-red-600"
                      onChange={(e) => handleSelectDistrict(e.target.value)}
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
                        onClick={() => setShowDistrictDropdown(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="size-3" /> ਵਾਪਸ
                      </button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleDismissLocation}
                        className="text-xs text-muted-foreground"
                      >
                        ਬਾਅਦ ਵਿੱਚ (Skip)
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Single focused button to choose area */
                  <div className="pt-2 space-y-2.5">
                    <Button
                      size="lg"
                      onClick={handleChooseAreaClick}
                      disabled={loadingLocation}
                      className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black text-sm justify-between shadow-md group transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className="size-4.5 group-hover:scale-110 transition-transform" />
                        {loadingLocation
                          ? "ਲੋਕੇਸ਼ਨ ਚੁਣੀ ਜਾ ਰਹੀ ਹੈ..."
                          : "ਆਪਣਾ ਇਲਾਕਾ ਚੁਣੋ (Choose Your Area)"}
                      </span>
                      <ChevronRight className="size-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowDistrictDropdown(true)}
                        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                      >
                        ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਸੂਚੀ ਵਿੱਚੋਂ ਚੁਣੋ (Select from list)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


