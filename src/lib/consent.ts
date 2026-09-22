export type ConsentPreferences = {
  essential: boolean; // Always true
  analytics: boolean; // Optional: Traffic stats, page views, aggregate metrics
  functional: boolean; // Optional: Font size preference, saved bookmarks
  timestamp: string;
  status: "all" | "essential_only" | "custom" | "pending";
};

const CONSENT_STORAGE_KEY = "tadkanewz_cookie_consent_v1";

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true,
  analytics: false,
  functional: false,
  timestamp: new Date().toISOString(),
  status: "pending",
};

export function getConsentPreferences(): ConsentPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as ConsentPreferences;
    return {
      ...parsed,
      essential: true, // always strictly necessary
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveConsentPreferences(
  prefs: Partial<ConsentPreferences> & { status: "all" | "essential_only" | "custom" }
): ConsentPreferences {
  const updated: ConsentPreferences = {
    essential: true,
    analytics: Boolean(prefs.analytics),
    functional: Boolean(prefs.functional),
    timestamp: new Date().toISOString(),
    status: prefs.status,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("tadkanewz_consent_changed", { detail: updated })
      );
    } catch (e) {
      console.error("Failed to save consent preferences:", e);
    }
  }

  return updated;
}

export function resetConsentPreferences(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent("tadkanewz_consent_changed", { detail: DEFAULT_PREFERENCES })
    );
  }
}

export function hasUserGivenConsent(): boolean {
  const prefs = getConsentPreferences();
  return prefs.status !== "pending";
}
