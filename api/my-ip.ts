export default function handler(req: any, res: any) {
  const forwarded = req.headers ? (req.headers["x-forwarded-for"] || req.headers["x-real-ip"]) : null;
  let clientIp = "127.0.0.1";
  if (forwarded) {
    clientIp = Array.isArray(forwarded) ? forwarded[0] : String(forwarded).split(",")[0].trim();
  }

  const city = req.headers && req.headers["x-vercel-ip-city"] ? decodeURIComponent(req.headers["x-vercel-ip-city"]) : undefined;
  const region = req.headers && req.headers["x-vercel-ip-country-region"] ? decodeURIComponent(req.headers["x-vercel-ip-country-region"]) : undefined;
  const country = req.headers && req.headers["x-vercel-ip-country"] ? decodeURIComponent(req.headers["x-vercel-ip-country"]) : undefined;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return res.status(200).json({
    ip: clientIp,
    city,
    region,
    country,
    approxRegion: [city, region, country].filter(Boolean).join(", ") || undefined,
  });
}
