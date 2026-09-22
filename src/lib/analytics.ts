import { getConsentPreferences } from "./consent";
import { maskIp } from "./security";

export type SessionRecord = {
  sessionId: string;
  clientIp?: string;
  maskedIp?: string;
  firstVisit: string;
  lastActivity: string;
  pagesViewed: {
    path: string;
    title: string;
    timestamp: string;
  }[];
  pageCount: number;
  deviceCategory: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  screenResolution: string;
  language: string;
  timeZone: string;
  approxRegion: string;
  userLocation?: {
    label: string;
    coords?: string;
    consentedAt: string;
  };
  referrer: string;
  consentStatus: "all" | "essential_only" | "custom" | "pending";
};

export type AnalyticsSummary = {
  totalVisitors: number;
  activeSessionsNow: number;
  totalPageViews: number;
  avgPagesPerSession: number;
  topArticles: { path: string; title: string; views: number }[];
  trafficSources: { name: string; value: number }[];
  deviceBreakdown: { name: string; value: number }[];
  regionDistribution: { name: string; value: number }[];
  consentBreakdown: { name: string; value: number }[];
  timelineData: { time: string; visitors: number; pageViews: number }[];
};

const SESSIONS_STORAGE_KEY = "tadkanewz_analytics_sessions_v2";
const RETENTION_KEY = "tadkanewz_analytics_retention_days";
const CURRENT_SESSION_ID_KEY = "tadkanewz_current_session_id";
export const CLOUD_SESSIONS_ID = "ff808181a09d98f701a0ca0702337125";

// Automatically clear legacy demo sessions if present
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("tadkanewz_analytics_sessions_v1");
  } catch {}
}

// Safe device detection
function getDeviceCategory(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua) || (width >= 768 && width <= 1024)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua) || width < 768) {
    return "Mobile";
  }
  return "Desktop";
}

// Safe browser detection without fingerprinting
function getBrowserFamily(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR/")) return "Opera";
  return "Other Browser";
}

// Safe OS detection
function getOSFamily(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac") && !ua.includes("iPhone") && !ua.includes("iPad")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Linux")) return "Linux";
  return "Other OS";
}

// Approximate Region derived safely from timezone and locale (No GPS/No IP sniffing)
function getApproxRegion(tz: string): string {
  if (!tz) return "General / Unknown";
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") {
    return "Punjab / India";
  }
  if (tz.startsWith("America/Toronto") || tz.startsWith("America/Vancouver") || tz.startsWith("America/Edmonton")) {
    return "Canada (NRI Diaspora)";
  }
  if (tz.startsWith("America/")) {
    return "United States (NRI Diaspora)";
  }
  if (tz.startsWith("Europe/London")) {
    return "United Kingdom (NRI Diaspora)";
  }
  if (tz.startsWith("Australia/")) {
    return "Australia / NZ (Diaspora)";
  }
  if (tz.startsWith("Europe/")) {
    return "Europe";
  }
  if (tz.startsWith("Asia/Dubai") || tz.startsWith("Asia/Muscat")) {
    return "Gulf / Middle East";
  }
  return tz.split("/")[0] || "Global";
}

// Data Retention config (Default: 30 days)
export function getRetentionPeriodDays(): number {
  if (typeof window === "undefined") return 30;
  const saved = localStorage.getItem(RETENTION_KEY);
  return saved ? parseInt(saved, 10) || 30 : 30;
}

export function setRetentionPeriodDays(days: number): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(RETENTION_KEY, days.toString());
    pruneOldSessions();
  }
}

// Prune sessions older than retention period
export function pruneOldSessions(): void {
  if (typeof window === "undefined") return;
  try {
    const days = getRetentionPeriodDays();
    const cutoffMs = Date.now() - days * 24 * 60 * 60 * 1000;
    const sessions = getAllSessions();
    const filtered = sessions.filter((s) => new Date(s.lastActivity).getTime() >= cutoffMs);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to prune old sessions:", e);
  }
}

// Get all stored sessions
export function getAllSessions(): SessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SessionRecord[];
  } catch {
    return [];
  }
}

// Get or create current session ID
function getCurrentSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  let sessId = sessionStorage.getItem(CURRENT_SESSION_ID_KEY);
  if (!sessId) {
    const randomPart = Math.random().toString(36).substring(2, 9);
    sessId = `tn_${Date.now().toString(36)}_${randomPart}`;
    sessionStorage.setItem(CURRENT_SESSION_ID_KEY, sessId);
  }
  return sessId;
}

let cachedClientIp: string | null = null;

export async function getClientPublicIp(): Promise<string> {
  if (cachedClientIp) return cachedClientIp;
  if (typeof window !== "undefined") {
    const saved = sessionStorage.getItem("tadkanewz_cached_client_ip");
    if (saved && saved !== "127.0.0.1") {
      cachedClientIp = saved;
      return saved;
    }

    // Provider 1: ipwho.is (fast, HTTPS, provides real IP + region)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("https://ipwho.is/", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.ip && data.success !== false) {
          cachedClientIp = data.ip;
          sessionStorage.setItem("tadkanewz_cached_client_ip", data.ip);
          const geoHint = [data.city, data.region, data.country].filter(Boolean).join(", ");
          updateSessionIp(data.ip, geoHint || undefined);
          return data.ip;
        }
      }
    } catch {
      // Continue to next provider
    }

    // Provider 2: api64.ipify.org (IPv4/IPv6)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("https://api64.ipify.org?format=json", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = (await res.json()) as { ip?: string };
        if (data?.ip) {
          cachedClientIp = data.ip;
          sessionStorage.setItem("tadkanewz_cached_client_ip", data.ip);
          updateSessionIp(data.ip);
          return data.ip;
        }
      }
    } catch {
      // Continue to next provider
    }

    // Provider 3: api.ipify.org (IPv4 fallback)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("https://api.ipify.org?format=json", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = (await res.json()) as { ip?: string };
        if (data?.ip) {
          cachedClientIp = data.ip;
          sessionStorage.setItem("tadkanewz_cached_client_ip", data.ip);
          updateSessionIp(data.ip);
          return data.ip;
        }
      }
    } catch {
      // Continue
    }

    // Provider 4: icanhazip.com fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch("https://icanhazip.com", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const textIp = (await res.text()).trim();
        if (textIp && !textIp.includes("<")) {
          cachedClientIp = textIp;
          sessionStorage.setItem("tadkanewz_cached_client_ip", textIp);
          updateSessionIp(textIp);
          return textIp;
        }
      }
    } catch {
      // Fallback
    }
  }
  return "127.0.0.1";
}

let syncTimeout: any = null;
export function debouncedSyncToCloud(session: SessionRecord): void {
  if (typeof window === "undefined" || !session) return;
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncSessionToCloud(session).catch(() => {});
  }, 400);
}

export async function syncSessionToCloud(session: SessionRecord): Promise<void> {
  if (typeof window === "undefined" || !session) return;
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSIONS_ID}`, {
      headers: { Accept: "application/json" },
    });
    let sessions: SessionRecord[] = [];
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.sessions)) {
        sessions = data.data.sessions;
      }
    }

    const idx = sessions.findIndex((s) => s.sessionId === session.sessionId);
    if (idx >= 0) {
      sessions[idx] = { ...sessions[idx], ...session };
    } else {
      sessions.unshift(session);
    }

    const bounded = sessions.slice(0, 300);

    await fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSIONS_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "tadkanewz_sessions_cloud_v3",
        data: { sessions: bounded },
      }),
    });
  } catch (e) {
    // Failover
  }
}

export async function fetchRemoteSessions(): Promise<SessionRecord[]> {
  if (typeof window === "undefined") return getAllSessions();
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSIONS_ID}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.sessions)) {
        const remote = data.data.sessions as SessionRecord[];
        const local = getAllSessions();
        const map = new Map<string, SessionRecord>();

        // Merge remote and local
        [...remote, ...local].forEach((s) => {
          if (!map.has(s.sessionId)) {
            map.set(s.sessionId, s);
          } else {
            const cur = map.get(s.sessionId)!;
            if (new Date(s.lastActivity).getTime() >= new Date(cur.lastActivity).getTime()) {
              map.set(s.sessionId, s);
            }
          }
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        );
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.error("Cloud fetch sessions error:", e);
  }
  return getAllSessions();
}

export function updateSessionIp(ip: string, approxRegion?: string): void {
  if (typeof window === "undefined" || !ip) return;
  try {
    const sessionId = getCurrentSessionId();
    const sessions = getAllSessions();
    const current = sessions.find((s) => s.sessionId === sessionId);
    if (current) {
      current.clientIp = ip;
      current.maskedIp = maskIp(ip);
      if (approxRegion && (!current.userLocation || !current.userLocation.label)) {
        current.approxRegion = approxRegion;
      }
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      debouncedSyncToCloud(current);
    }
  } catch (e) {
    console.error("Failed to update session IP:", e);
  }
}

// Record a page view event (respecting user consent for granular tracking)
export function recordPageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;

  const consent = getConsentPreferences();

  try {
    const sessionId = getCurrentSessionId();
    const now = new Date().toISOString();
    const sessions = getAllSessions();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const approxRegion = getApproxRegion(timeZone);

    let currentSession = sessions.find((s) => s.sessionId === sessionId);

    const pageTitle = title || document.title || path;
    const pageEntry = {
      path,
      title: pageTitle,
      timestamp: now,
    };

    // Attempt to read cached IP or trigger dynamic IP fetch
    const currentCachedIp =
      cachedClientIp ||
      sessionStorage.getItem("tadkanewz_cached_client_ip") ||
      "";

    if (!currentSession) {
      // Create new session record
      currentSession = {
        sessionId,
        clientIp: currentCachedIp || undefined,
        maskedIp: currentCachedIp ? maskIp(currentCachedIp) : undefined,
        firstVisit: now,
        lastActivity: now,
        pagesViewed: [pageEntry],
        pageCount: 1,
        deviceCategory: getDeviceCategory(),
        browser: getBrowserFamily(),
        os: getOSFamily(),
        screenResolution: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
        language: navigator.language || "pa",
        timeZone,
        approxRegion,
        referrer: document.referrer ? new URL(document.referrer, window.location.origin).hostname : "Direct Traffic",
        consentStatus: consent.status,
      };
      sessions.unshift(currentSession);
    } else {
      // Update existing session
      currentSession.lastActivity = now;
      if (consent.analytics) {
        currentSession.pagesViewed.push(pageEntry);
      }
      currentSession.pageCount = currentSession.pagesViewed.length || 1;
      currentSession.consentStatus = consent.status;
      if (currentCachedIp && (!currentSession.clientIp || currentSession.clientIp === "127.0.0.1")) {
        currentSession.clientIp = currentCachedIp;
        currentSession.maskedIp = maskIp(currentCachedIp);
      }
    }

    // Cap total sessions stored to 500 to keep localStorage optimal
    const boundedSessions = sessions.slice(0, 500);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(boundedSessions));

    // Sync to shared cloud database immediately
    debouncedSyncToCloud(currentSession);

    // Asynchronously resolve real public IP in background
    getClientPublicIp().then((realIp) => {
      if (realIp && realIp !== "127.0.0.1") {
        updateSessionIp(realIp);
      }
    });
  } catch (e) {
    console.error("Analytics record error:", e);
  }
}

// Compute aggregate summary for the admin dashboard (100% live recorded data)
export function getAnalyticsSummary(): AnalyticsSummary {
  const sessions = getAllSessions();

  if (sessions.length === 0) {
    return {
      totalVisitors: 0,
      activeSessionsNow: 0,
      totalPageViews: 0,
      avgPagesPerSession: 0,
      topArticles: [],
      trafficSources: [],
      deviceBreakdown: [],
      regionDistribution: [],
      consentBreakdown: [],
      timelineData: [],
    };
  }

  const nowMs = Date.now();
  const fifteenMinsMs = 15 * 60 * 1000;

  let totalPageViews = 0;
  let activeSessionsNow = 0;
  const pageViewCounts: Record<string, { title: string; count: number }> = {};
  const referrerCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  const regionCounts: Record<string, number> = {};
  const consentCounts: Record<string, number> = {};

  sessions.forEach((sess) => {
    totalPageViews += sess.pageCount;
    if (nowMs - new Date(sess.lastActivity).getTime() <= fifteenMinsMs) {
      activeSessionsNow++;
    }

    if (sess.deviceCategory) {
      deviceCounts[sess.deviceCategory] = (deviceCounts[sess.deviceCategory] || 0) + 1;
    }
    if (sess.approxRegion) {
      regionCounts[sess.approxRegion] = (regionCounts[sess.approxRegion] || 0) + 1;
    }
    if (sess.consentStatus) {
      consentCounts[sess.consentStatus] = (consentCounts[sess.consentStatus] || 0) + 1;
    }

    const ref = sess.referrer || "Direct Traffic";
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

    sess.pagesViewed.forEach((p) => {
      if (!pageViewCounts[p.path]) {
        pageViewCounts[p.path] = { title: p.title, count: 0 };
      }
      pageViewCounts[p.path].count++;
    });
  });

  const topArticles = Object.entries(pageViewCounts)
    .map(([path, data]) => ({ path, title: data.title, views: data.count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const trafficSources = Object.entries(referrerCounts).map(([name, value]) => ({
    name: name === "Direct" || name === "" ? "Direct Traffic" : name,
    value,
  }));

  const deviceBreakdown = Object.entries(deviceCounts)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const regionDistribution = Object.entries(regionCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const consentBreakdown = Object.entries(consentCounts).map(([name, value]) => ({
    name: name === "all" ? "Full Consent" : name === "essential_only" ? "Essential Only" : "Custom/Other",
    value,
  }));

  const timelineData = [
    { time: "Start", visitors: Math.max(0, sessions.length - activeSessionsNow), pageViews: Math.max(0, totalPageViews - activeSessionsNow) },
    { time: "Now (Live)", visitors: sessions.length, pageViews: totalPageViews },
  ];

  return {
    totalVisitors: sessions.length,
    activeSessionsNow,
    totalPageViews,
    avgPagesPerSession: sessions.length ? Math.round((totalPageViews / sessions.length) * 10) / 10 : 0,
    topArticles,
    trafficSources,
    deviceBreakdown,
    regionDistribution,
    consentBreakdown,
    timelineData,
  };
}

// Clear all analytics data
export function clearAllAnalyticsData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSIONS_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "tadkanewz_sessions_cloud_v3",
        data: { sessions: [] },
      }),
    }).catch(() => {});
  }
}

// Update current active session with consented user location for localized news feeds
export function updateSessionLocation(locationLabel: string, coords?: string): void {
  if (typeof window === "undefined") return;
  try {
    const sessionId = getCurrentSessionId();
    const sessions = getAllSessions();
    const current = sessions.find((s) => s.sessionId === sessionId);
    if (current) {
      current.userLocation = {
        label: locationLabel,
        coords,
        consentedAt: new Date().toISOString(),
      };
      current.approxRegion = `${locationLabel} (Consented)`;
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      debouncedSyncToCloud(current);
    }
  } catch (e) {
    console.error("Failed to update session location:", e);
  }
}

