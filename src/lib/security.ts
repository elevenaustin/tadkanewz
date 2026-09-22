import { supabase } from "./supabase";

export const FIREWALL_CHANNEL = "tadkanewz_prod_firewall_live_v5";
export const SECURITY_CHANNEL = "tadkanewz_prod_security_live_v5";

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

export async function syncBlockedIpsToCloud(list: BlockedIpRecord[]): Promise<void> {
  if (typeof window === "undefined") return;

  // 1. Primary: Upsert to Supabase PostgreSQL blocked_ips table
  try {
    if (list.length > 0) {
      const rows = list.map((item) => ({
        id: item.id || `blk_${Date.now()}`,
        ip: item.ip.trim(),
        reason: item.reason || "Blocked by Administrator",
        blocked_by: item.blockedBy || "Admin",
        blocked_at: item.blockedAt || new Date().toISOString(),
      }));
      await supabase.from("blocked_ips").upsert(rows, { onConflict: "ip" });
    }
  } catch {}

  // 2. Secondary failover: broadcast via SSE stream
  try {
    await fetch(`https://ntfy.sh/${FIREWALL_CHANNEL}`, {
      method: "POST",
      headers: {
        "Title": "blocked_ips",
        "Priority": "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blockedIps: list }),
    });
  } catch {}
}

export async function fetchRemoteBlockedIps(): Promise<BlockedIpRecord[]> {
  if (typeof window === "undefined") return getBlockedIps();

  // 1. Primary: Fetch from Supabase blocked_ips table
  try {
    const { data, error } = await supabase.from("blocked_ips").select("*");
    if (!error && Array.isArray(data) && data.length > 0) {
      const records: BlockedIpRecord[] = data.map((d: any) => ({
        id: d.id,
        ip: d.ip,
        reason: d.reason || "Blocked by Administrator",
        blockedAt: d.blocked_at || new Date().toISOString(),
        blockedBy: d.blocked_by || "Admin",
      }));
      localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(records));
      return records;
    }
  } catch {}

  // 2. Secondary failover: ntfy
  try {
    const res = await fetch(`https://ntfy.sh/${FIREWALL_CHANNEL}/json?poll=1&since=all`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split("\n").filter(Boolean);
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const envelope = JSON.parse(lines[i]);
          if (envelope?.message) {
            const data = JSON.parse(envelope.message);
            if (Array.isArray(data?.blockedIps)) {
              localStorage.setItem(BLOCKED_IPS_KEY, JSON.stringify(data.blockedIps));
              return data.blockedIps;
            }
          }
        } catch {}
      }
    }
  } catch {}
  return getBlockedIps();
}

export async function syncSecurityLogToCloud(entry: SecurityAccessLog): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch(`https://ntfy.sh/${SECURITY_CHANNEL}`, {
      method: "POST",
      headers: {
        "Title": "security_log",
        "Priority": "1",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    });
  } catch {}
}

export async function fetchRemoteSecurityLogs(): Promise<SecurityAccessLog[]> {
  if (typeof window === "undefined") return getSecurityLogs();
  try {
    const res = await fetch(`https://ntfy.sh/${SECURITY_CHANNEL}/json?poll=1&since=all`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split("\n").filter(Boolean);
      const remoteLogs: SecurityAccessLog[] = [];
      for (const line of lines) {
        try {
          const envelope = JSON.parse(line);
          if (envelope?.message) {
            const log = JSON.parse(envelope.message);
            if (log && log.id && log.ip) {
              remoteLogs.push(log);
            }
          }
        } catch {}
      }

      if (remoteLogs.length > 0) {
        const local = getSecurityLogs();
        const map = new Map<string, SecurityAccessLog>();
        [...remoteLogs, ...local].forEach((l) => {
          if (!map.has(l.id)) map.set(l.id, l);
        });
        const merged = Array.from(map.values())
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 100);
        localStorage.setItem(SECURITY_LOGS_KEY, JSON.stringify(merged));
        return merged;
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
    supabase.from("blocked_ips").delete().eq("ip", cleanIp).then(() => {}).catch(() => {});
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
