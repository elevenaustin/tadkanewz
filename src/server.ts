import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// Global server-side persistent memory stores
declare global {
  var __tadkanewz_sessions: any[];
  var __tadkanewz_blocked_ips: any[];
  var __tadkanewz_security_logs: any[];
}

if (!globalThis.__tadkanewz_sessions) {
  globalThis.__tadkanewz_sessions = [];
}
if (!globalThis.__tadkanewz_blocked_ips) {
  globalThis.__tadkanewz_blocked_ips = [];
}
if (!globalThis.__tadkanewz_security_logs) {
  globalThis.__tadkanewz_security_logs = [];
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-requested-with",
};

function extractClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first && first !== "::1") return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "::1") return realIp;
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && cfIp !== "::1") return cfIp;
  return "127.0.0.1";
}

function extractGeoInfo(request: Request) {
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");
  const parts = [city, region, country].filter(Boolean);
  return {
    city: city ? decodeURIComponent(city) : undefined,
    region: region ? decodeURIComponent(region) : undefined,
    country: country ? decodeURIComponent(country) : undefined,
    approxRegion: parts.length > 0 ? parts.map((p) => decodeURIComponent(p!)).join(", ") : undefined,
  };
}

async function handleApiRequests(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Route 1: Real-time public IP & Geo from edge server
  if (url.pathname === "/api/my-ip") {
    const clientIp = extractClientIp(request);
    const geo = extractGeoInfo(request);
    return new Response(
      JSON.stringify({
        ip: clientIp,
        ...geo,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  }

  // Route 2: Central Sessions Telemetry Store
  if (url.pathname === "/api/sessions") {
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ sessions: globalThis.__tadkanewz_sessions || [] }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (request.method === "POST" || request.method === "PUT") {
      try {
        const body = (await request.json()) as any;
        const incomingSession = body.session || body;
        if (!incomingSession || !incomingSession.sessionId) {
          return new Response(JSON.stringify({ error: "Missing sessionId" }), {
            status: 400,
            headers: CORS_HEADERS,
          });
        }

        // Auto-fill real client IP from edge headers if not already resolved or localhost
        const edgeIp = extractClientIp(request);
        if ((!incomingSession.clientIp || incomingSession.clientIp === "127.0.0.1") && edgeIp !== "127.0.0.1") {
          incomingSession.clientIp = edgeIp;
        }

        const geo = extractGeoInfo(request);
        if (geo.approxRegion && (!incomingSession.approxRegion || incomingSession.approxRegion === "Punjab / India")) {
          incomingSession.approxRegion = geo.approxRegion;
        }

        const list = globalThis.__tadkanewz_sessions || [];
        const idx = list.findIndex((s: any) => s.sessionId === incomingSession.sessionId);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...incomingSession };
        } else {
          list.unshift(incomingSession);
        }

        globalThis.__tadkanewz_sessions = list.slice(0, 500);
        return new Response(
          JSON.stringify({ success: true, count: globalThis.__tadkanewz_sessions.length }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    if (request.method === "DELETE") {
      globalThis.__tadkanewz_sessions = [];
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }
  }

  // Route 3: Firewall Blocked IPs
  if (url.pathname === "/api/blocked-ips") {
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ blockedIps: globalThis.__tadkanewz_blocked_ips || [] }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (request.method === "POST") {
      try {
        const body = (await request.json()) as any;
        if (body.blockedIps && Array.isArray(body.blockedIps)) {
          globalThis.__tadkanewz_blocked_ips = body.blockedIps;
        } else if (body.ip) {
          const cleanIp = body.ip.trim();
          const list = globalThis.__tadkanewz_blocked_ips || [];
          if (!list.some((b: any) => b.ip === cleanIp)) {
            list.unshift({
              id: `blk_${Date.now()}`,
              ip: cleanIp,
              reason: body.reason || "Blocked by Admin",
              blockedAt: new Date().toISOString(),
              blockedBy: body.user || "Admin",
            });
            globalThis.__tadkanewz_blocked_ips = list;
          }
        }
        return new Response(
          JSON.stringify({ success: true, blockedIps: globalThis.__tadkanewz_blocked_ips }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err?.message }), {
          status: 500,
          headers: CORS_HEADERS,
        });
      }
    }

    if (request.method === "DELETE") {
      try {
        const body = (await request.json()) as any;
        if (body?.ip) {
          const list = globalThis.__tadkanewz_blocked_ips || [];
          globalThis.__tadkanewz_blocked_ips = list.filter((b: any) => b.ip !== body.ip.trim());
        } else {
          globalThis.__tadkanewz_blocked_ips = [];
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      } catch {
        globalThis.__tadkanewz_blocked_ips = [];
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      }
    }
  }

  // Route 4: Security Access Logs Stream
  if (url.pathname === "/api/security-logs") {
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({ securityLogs: globalThis.__tadkanewz_security_logs || [] }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (request.method === "POST") {
      try {
        const body = (await request.json()) as any;
        const entry = body.entry || body;
        if (entry && entry.id) {
          const list = globalThis.__tadkanewz_security_logs || [];
          list.unshift(entry);
          globalThis.__tadkanewz_security_logs = list.slice(0, 100);
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: CORS_HEADERS,
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid log payload" }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }
    }
  }

  return null;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // 1. First intercept API endpoints
      const apiResponse = await handleApiRequests(request);
      if (apiResponse) {
        return apiResponse;
      }

      // 2. Otherwise pass to standard TanStack Start / Nitro SSR handler
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
