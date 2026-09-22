export type AdminUser = {
  username: string;
  role: "Administrator";
  loginTime: string;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
};

const AUTH_TOKEN_KEY = "tadkanewz_admin_session_token";
const USER_INFO_KEY = "tadkanewz_admin_user_info";
const FAILED_ATTEMPTS_KEY = "tadkanewz_admin_failed_attempts";
const LOCKOUT_KEY = "tadkanewz_admin_lockout_until";
const AUDIT_LOGS_KEY = "tadkanewz_admin_audit_logs";

// Read from env with development fallback
export function getExpectedAdminCredentials() {
  const envUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin@KhusH";
  return {
    username: envUsername,
    password: envPassword,
  };
}

export function checkLockout(): { locked: boolean; remainingSeconds: number } {
  if (typeof window === "undefined") return { locked: false, remainingSeconds: 0 };
  const lockoutUntil = sessionStorage.getItem(LOCKOUT_KEY);
  if (!lockoutUntil) return { locked: false, remainingSeconds: 0 };
  const diff = parseInt(lockoutUntil, 10) - Date.now();
  if (diff <= 0) {
    sessionStorage.removeItem(LOCKOUT_KEY);
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    return { locked: false, remainingSeconds: 0 };
  }
  return { locked: true, remainingSeconds: Math.ceil(diff / 1000) };
}

export async function loginAdmin(
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined") {
    return { success: false, message: "Window unavailable" };
  }

  const { locked, remainingSeconds } = checkLockout();
  if (locked) {
    return {
      success: false,
      message: `Too many failed attempts. Please wait ${remainingSeconds} seconds.`,
    };
  }

  const { username, password } = getExpectedAdminCredentials();

  if (usernameInput.trim() === username && passwordInput === password) {
    // Reset rate limiter
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    sessionStorage.removeItem(LOCKOUT_KEY);

    // Generate secure randomized session token
    const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const userInfo: AdminUser = {
      username: usernameInput,
      role: "Administrator",
      loginTime: new Date().toISOString(),
    };

    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

    addAuditLog("Admin Login", "Logged in to TadkaNewz Admin Panel");

    return { success: true, message: "Login successful" };
  } else {
    // Increment failed attempts
    const attempts = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || "0", 10) + 1;
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());

    if (attempts >= 5) {
      const lockUntil = Date.now() + 60 * 1000; // 1 min lockout
      sessionStorage.setItem(LOCKOUT_KEY, lockUntil.toString());
      return {
        success: false,
        message: "Maximum login attempts exceeded. Account locked for 60 seconds.",
      };
    }

    return {
      success: false,
      message: `Invalid credentials. (${5 - attempts} attempts remaining)`,
    };
  }
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  addAuditLog("Admin Logout", "Logged out of Admin Panel");
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(USER_INFO_KEY);
}

export function isAuthenticatedAdmin(): boolean {
  if (typeof window === "undefined") return false;
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const user = sessionStorage.getItem(USER_INFO_KEY);
  return Boolean(token && user);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const user = sessionStorage.getItem(USER_INFO_KEY);
  if (!user) return null;
  try {
    return JSON.parse(user) as AdminUser;
  } catch {
    return null;
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) {
      return [
        {
          id: "log_1",
          action: "System Initialized",
          details: "TadkaNewz Admin Portal and Analytics active",
          timestamp: new Date().toISOString(),
          user: "System",
        },
      ];
    }
    return JSON.parse(raw) as AuditLogEntry[];
  } catch {
    return [];
  }
}

export function addAuditLog(action: string, details: string): void {
  if (typeof window === "undefined") return;
  try {
    const logs = getAuditLogs();
    const user = getAdminUser()?.username || "Admin";
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      user,
    };
    logs.unshift(entry);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error("Failed to add audit log:", e);
  }
}
