import { useState, useEffect } from "react";
import {
  MapPin,
  Sparkles,
  X,
  CheckCircle2,
  Navigation,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateSessionLocation } from "@/lib/analytics";

const PROMPT_DISMISSED_KEY = "tadkanewz_local_news_prompt_v1";

const PUNJAB_DISTRICTS = [
  "ਬਰਨਾਲਾ (Barnala)",
  "ਲੁਧਿਆਣਾ (Ludhiana)",
  "ਅੰਮ੍ਰਿਤਸਰ (Amritsar)",
  "ਜਲੰਧਰ (Jalandhar)",
  "ਪਟਿਆਲਾ (Patiala)",
  "ਬਠਿੰਡਾ (Bathinda)",
  "ਮੋਹਾਲੀ (SAS Nagar / Mohali)",
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
  "ਚੰਡੀਗੜ੍ਹ (Chandigarh)",
];

export function LocalNewsPrompt() {
  const [show, setShow] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showManualDropdown, setShowManualDropdown] = useState(false);

  useEffect(() => {
    // Only show if not dismissed and not already chosen
    const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 2500); // 2.5s delay after page loads
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_DISMISSED_KEY, "dismissed");
    setShow(false);
  };

  const handleManualSelect = (district: string) => {
    setSelectedArea(district);
    updateSessionLocation(district);
    localStorage.setItem(PROMPT_DISMISSED_KEY, district);
    setStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${district} ਸੈੱਟ ਕੀਤਾ ਗਿਆ ਹੈ!`);
    setTimeout(() => {
      setShow(false);
    }, 2000);
  };

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

        // Approximate Punjab district detection or fallback
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

        setSelectedArea(detectedDistrict);
        updateSessionLocation(detectedDistrict, coordsStr);
        localStorage.setItem(PROMPT_DISMISSED_KEY, detectedDistrict);
        setStatusMsg(`ਤੁਹਾਡਾ ਇਲਾਕਾ: ${detectedDistrict} ਸਫਲਤਾਪੂਰਵਕ ਚੁਣਿਆ ਗਿਆ!`);

        setTimeout(() => {
          setShow(false);
        }, 2200);
      },
      (error) => {
        setLoading(false);
        // Fallback to manual selection if GPS permission denied or unavailable
        setShowManualDropdown(true);
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-xl border-2 border-primary/40 bg-card p-5 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-full bg-red-600 text-white shadow shrink-0">
              <MapPin className="size-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                LOCAL NEWS FEED (ਖੇਤਰੀ ਖ਼ਬਰਾਂ)
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground mt-0.5">
                ਆਪਣੇ ਇਲਾਕੇ ਦੀਆਂ ਖ਼ਬਰਾਂ ਪ੍ਰਾਪਤ ਕਰੋ
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="ਬੰਦ ਕਰੋ"
          >
            <X className="size-4" />
          </button>
        </div>

        {statusMsg ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-xs font-bold text-green-700 dark:text-green-400 animate-in fade-in">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        ) : (
          <>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              ਪੰਜਾਬ ਦੇ ਆਪਣੇ ਜ਼ਿਲ੍ਹੇ (ਬਰਨਾਲਾ, ਲੁਧਿਆਣਾ, ਅੰਮ੍ਰਿਤਸਰ, ਜਲੰਧਰ ਆਦਿ) ਦੀਆਂ ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਅਤੇ ਸਥਾਨਕ ਅਪਡੇਟਸ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ।
            </p>

            {showManualDropdown ? (
              <div className="mt-4 space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground block">
                  ਆਪਣਾ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ (Select Your District):
                </label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs font-semibold"
                  onChange={(e) => handleManualSelect(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ...
                  </option>
                  {PUNJAB_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleEnableGps}
                  disabled={loading}
                  className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white gap-1.5 h-9 flex-1"
                >
                  <Navigation className="size-3.5" />
                  {loading ? "ਲੋਕੇਸ਼ਨ ਚੁਣੀ ਜਾ ਰਹੀ ਹੈ..." : "ਹਾਂ, ਸਥਾਨਕ ਖ਼ਬਰਾਂ ਵੇਖੋ"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowManualDropdown(true)}
                  className="text-xs h-9"
                >
                  ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs text-muted-foreground h-9"
                >
                  ਬਾਅਦ ਵਿੱਚ
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
