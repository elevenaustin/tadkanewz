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

const BLOCKED_IPS_KEY = "tadkanewz_blocked_ips_v2";
const SECURITY_LOGS_KEY = "tadkanewz_security_access_logs_v2";

// Clear legacy demo keys if present
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("tadkanewz_blocked_ips_list");
    localStorage.removeItem("tadkanewz_security_access_logs");
  } catch {}
}

export const CLOUD_BLOCKED_IPS_ID = "ff808181a09d98f701a0ca0702d77126";
export const CLOUD_SECURITY_LOGS_ID = "ff808181a09d98f701a0ca0703777127";

export async function syncBlockedIpsToCloud(list: BlockedIpRecord[]): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_BLOCKED_IPS_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "tadkanewz_blocked_ips_v3",
        data: { blockedIps: list },
      }),
    });
  } catch {}
}

export async function fetchRemoteBlockedIps(): Promise<BlockedIpRecord[]> {
  if (typeof window === "undefined") return getBlockedIps();
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_BLOCKED_IPS_ID}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.blockedIps)) {
        const remote = data.data.blockedIps as BlockedIpRecord[];
        localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(remote));
        return remote;
      }
    }
  } catch {}
  return getBlockedIps();
}

export async function syncSecurityLogToCloud(entry: SecurityAccessLog): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_SECURITY_LOGS_ID}`, {
      headers: { Accept: "application/json" },
    });
    let logs: SecurityAccessLog[] = [];
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.securityLogs)) {
        logs = data.data.securityLogs;
      }
    }
    logs.unshift(entry);
    const bounded = logs.slice(0, 100);
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_SECURITY_LOGS_ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "tadkanewz_security_logs_v3",
        data: { securityLogs: bounded },
      }),
    });
  } catch {}
}

export async function fetchRemoteSecurityLogs(): Promise<SecurityAccessLog[]> {
  if (typeof window === "undefined") return getSecurityLogs();
  try {
    const res = await fetch(`https://api.restful-api.dev/objects/${CLOUD_SECURITY_LOGS_ID}`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data?.securityLogs)) {
        const remote = data.data.securityLogs as SecurityAccessLog[];
        localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(remote));
        return remote;
      }
    }
  } catch {}
  return getSecurityLogs();
}

export function getBlockedIps(): BlockedIpRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BLOCKED_IPS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BlockedIpRecord[];
  } catch {
    return [];
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
    syncBlockedIpsToCloud(list);
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
    syncBlockedIpsToCloud(filtered);
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
    if (!raw) return [];
    return JSON.parse(raw) as SecurityAccessLog[];
  } catch {
    return [];
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
    syncSecurityLogToCloud(entry);
  } catch (e) {
    console.error("Failed to log security access:", e);
  }
}
