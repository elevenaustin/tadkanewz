export type BlockedIpRecord = {
  id: string;
  ip: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
};

export type SecurityAccessLog = {
  id: string;
  ip: string;
  maskedIp: string;
  path: string;
  timestamp: string;
  status: "Allowed" | "Blocked";
  reason?: string;
  countryOrRegion?: string;
  userAgent?: string;
};

const BLOCKED_IPS_KEY = "tadkanewz_blocked_ips_list";
const SECURITY_LOGS_KEY = "tadkanewz_security_access_logs";

// Initial sample blocked IPs for firewall simulation
const DEFAULT_BLOCKED_IPS: BlockedIpRecord[] = [
  {
    id: "blk_1",
    ip: "198.51.100.42",
    reason: "Suspicious automated scraping / Bot traffic",
    blockedAt: "2026-09-22T10:15:00.000Z",
    blockedBy: "Admin",
  },
  {
    id: "blk_2",
    ip: "203.0.113.88",
    reason: "Excessive rapid requests / Rate limit violation",
    blockedAt: "2026-09-22T11:30:00.000Z",
    blockedBy: "Admin",
  },
];

export function getBlockedIps(): BlockedIpRecord[] {
  if (typeof window === "undefined") return DEFAULT_BLOCKED_IPS;
  try {
    const raw = localStorage.getItem(BLOCKED_IPS_KEY);
    if (!raw) {
      localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(DEFAULT_BLOCKED_IPS));
      return DEFAULT_BLOCKED_IPS;
    }
    return JSON.parse(raw) as BlockedIpRecord[];
  } catch {
    return DEFAULT_BLOCKED_IPS;
  }
}

export function isIpBlocked(ip: string): boolean {
  if (!ip) return false;
  const list = getBlockedIps();
  return list.some((item) => item.ip.trim() === ip.trim());
}

export function blockIp(ip: string, reason: string = "Unwanted / Abusive traffic", user: string = "Admin"): boolean {
  if (!ip || !ip.trim()) return false;
  const cleanIp = ip.trim();
  const list = getBlockedIps();

  if (list.some((item) => item.ip === cleanIp)) {
    return false; // already blocked
  }

  const newRecord: BlockedIpRecord = {
    id: `blk_${Date.now()}`,
    ip: cleanIp,
    reason,
    blockedAt: new Date().toISOString(),
    blockedBy: user,
  };

  list.unshift(newRecord);
  if (typeof window !== "undefined") {
    localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(list));
  }
  return true;
}

export function unblockIp(ip: string): boolean {
  if (!ip) return false;
  const cleanIp = ip.trim();
  const list = getBlockedIps();
  const filtered = list.filter((item) => item.ip !== cleanIp);

  if (typeof window !== "undefined") {
    localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(filtered));
  }
  return true;
}

// Mask IP for privacy preservation in standard user-facing views (GDPR compliant)
export function maskIp(ip: string): string {
  if (!ip) return "Unknown";
  if (ip.includes(":")) {
    // IPv6
    const parts = ip.split(":");
    return `${parts.slice(0, 3).join(":")}:****:****`;
  }
  // IPv4
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }
  return ip;
}

export function getSecurityLogs(): SecurityAccessLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SECURITY_LOGS_KEY);
    if (!raw) {
      return generateInitialSecurityLogs();
    }
    return JSON.parse(raw) as SecurityAccessLog[];
  } catch {
    return generateInitialSecurityLogs();
  }
}

export function logSecurityAccess(
  ip: string,
  path: string,
  status: "Allowed" | "Blocked",
  region?: string,
  reason?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const logs = getSecurityLogs();
    const entry: SecurityAccessLog = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ip: ip || "127.0.0.1",
      maskedIp: maskIp(ip || "127.0.0.1"),
      path,
      timestamp: new Date().toISOString(),
      status,
      countryOrRegion: region || "Punjab / India",
      reason: reason || (status === "Blocked" ? "IP is in blocklist" : undefined),
    };

    logs.unshift(entry);
    localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error("Failed to log security access:", e);
  }
}

function generateInitialSecurityLogs(): SecurityAccessLog[] {
  const now = Date.now();
  return [
    {
      id: "sec_1",
      ip: "103.217.158.45",
      maskedIp: "103.217.***.***",
      path: "/newslink",
      timestamp: new Date(now - 2 * 60 * 1000).toISOString(),
      status: "Allowed",
      countryOrRegion: "Ludhiana, Punjab",
    },
    {
      id: "sec_2",
      ip: "106.213.82.112",
      maskedIp: "106.213.***.***",
      path: "/category/entertainment",
      timestamp: new Date(now - 5 * 60 * 1000).toISOString(),
      status: "Allowed",
      countryOrRegion: "Amritsar, Punjab",
    },
    {
      id: "sec_3",
      ip: "198.51.100.42",
      maskedIp: "198.51.***.***",
      path: "/admin/login",
      timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
      status: "Blocked",
      reason: "IP in firewall blocklist",
      countryOrRegion: "Suspicious Proxy",
    },
    {
      id: "sec_4",
      ip: "142.250.180.206",
      maskedIp: "142.250.***.***",
      path: "/write",
      timestamp: new Date(now - 18 * 60 * 1000).toISOString(),
      status: "Allowed",
      countryOrRegion: "Toronto, Canada",
    },
    {
      id: "sec_5",
      ip: "203.0.113.88",
      maskedIp: "203.0.***.***",
      path: "/api/search",
      timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
      status: "Blocked",
      reason: "Rate limit violation",
      countryOrRegion: "Unwanted Bot Network",
    },
  ];
}
