import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Eye,
  FileText,
  Clock,
  Shield,
  LogOut,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Radio,
  Sliders,
  Sparkles,
  Layers,
  Flame,
  PieChart as PieIcon,
  Activity,
  Calendar,
  Lock,
  ShieldAlert,
  Ban,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brand } from "@/components/news/brand";
import {
  isAuthenticatedAdmin,
  logoutAdmin,
  getAdminUser,
  getAuditLogs,
  addAuditLog,
} from "@/lib/admin-auth";
import {
  getAnalyticsSummary,
  getAllSessions,
  getRetentionPeriodDays,
  setRetentionPeriodDays,
  clearAllAnalyticsData,
  pruneOldSessions,
  type SessionRecord,
  type AnalyticsSummary,
} from "@/lib/analytics";
import {
  getBlockedIps,
  blockIp,
  unblockIp,
  isIpBlocked,
  getSecurityLogs,
  type BlockedIpRecord,
  type SecurityAccessLog,
} from "@/lib/security";
import { stories as initialStories, categories, type Story } from "@/lib/news-data";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Analytics — TadkaNewz" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboardPage,
});

const PIE_COLORS = ["#DC2626", "#F59E0B", "#2563EB", "#10B981", "#8B5CF6", "#64748B"];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "sessions" | "security" | "articles" | "categories" | "settings"
  >("overview");

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [sessionSearch, setSessionSearch] = useState("");
  const [articleList, setArticleList] = useState<Story[]>(initialStories);
  const [articleSearch, setArticleSearch] = useState("");
  const [retentionDays, setRetentionDays] = useState(30);
  const [auditLogs, setAuditLogs] = useState(getAuditLogs());
  const [blockedIps, setBlockedIps] = useState<BlockedIpRecord[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAccessLog[]>([]);
  const [newBlockIp, setNewBlockIp] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("Suspicious automated scraping");
  const [showNewArticleModal, setShowNewArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "ਪੰਜਾਬ",
    categorySlug: "punjab",
    author: "Admin Desk",
    summary: "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isAuthenticatedAdmin()) {
      navigate({ to: "/admin/login" });
      return;
    }
    loadData();
    setRetentionDays(getRetentionPeriodDays());
  }, [navigate]);

  const loadData = () => {
    pruneOldSessions();
    const sum = getAnalyticsSummary();
    const sess = getAllSessions();
    setSummary(sum);
    setSessions(sess);
    setAuditLogs(getAuditLogs());
    setBlockedIps(getBlockedIps());
    setSecurityLogs(getSecurityLogs());
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate({ to: "/admin/login" });
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleBlockIp = (ip: string, reason: string = "Blocked by Administrator") => {
    if (!ip) return;
    const success = blockIp(ip, reason);
    if (success) {
      addAuditLog("IP Blocked", `Blocked IP: ${ip} (Reason: ${reason})`);
      loadData();
      showToast(`IP ${ip} ਨੂੰ ਸਫਲਤਾਪੂਰਵਕ ਬਲਾਕ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।`);
    } else {
      showToast(`IP ${ip} ਪਹਿਲਾਂ ਹੀ ਬਲਾਕ ਕੀਤੀ ਗਈ ਹੈ।`);
    }
  };

  const handleUnblockIp = (ip: string) => {
    if (!ip) return;
    unblockIp(ip);
    addAuditLog("IP Unblocked", `Unblocked IP: ${ip}`);
    loadData();
    showToast(`IP ${ip} ਨੂੰ ਅਨ-ਬਲਾਕ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।`);
  };

  const handleManualBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockIp.trim()) return;
    handleBlockIp(newBlockIp.trim(), newBlockReason);
    setNewBlockIp("");
  };

  const handleRetentionChange = (days: number) => {
    setRetentionDays(days);
    setRetentionPeriodDays(days);
    addAuditLog("Retention Updated", `Changed data retention period to ${days} days`);
    loadData();
    showToast(`ਡਾਟਾ ਰਿਟੈਂਸ਼ਨ ${days} ਦਿਨਾਂ ਲਈ ਸੈੱਟ ਕੀਤੀ ਗਈ।`);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all recorded analytics sessions?")) {
      clearAllAnalyticsData();
      addAuditLog("Analytics Cleared", "Admin cleared all recorded analytics sessions");
      loadData();
      showToast("ਸਾਰੇ ਐਨਾਲਿਟਿਕਸ ਸੈਸ਼ਨ ਸਾਫ਼ ਕਰ ਦਿੱਤੇ ਗਏ ਹਨ।");
    }
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim()) return;

    const createdStory: Story = {
      id: Date.now(),
      title: newArticle.title,
      category: newArticle.category,
      categorySlug: newArticle.categorySlug,
      slug: newArticle.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30) || "news-update",
      summary: newArticle.summary || "ਤਾਜ਼ਾ ਪੰਜਾਬੀ ਖ਼ਬਰਾਂ TadkaNewz ਉੱਤੇ।",
      image: articleList[0]?.image || "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "22 ਸਤੰਬਰ 2026",
      author: newArticle.author,
      readTime: "3 ਮਿੰਟ",
    };

    setArticleList([createdStory, ...articleList]);
    addAuditLog("Article Created", `Created article: "${newArticle.title}"`);
    setShowNewArticleModal(false);
    setNewArticle({
      title: "",
      category: "ਪੰਜਾਬ",
      categorySlug: "punjab",
      author: "Admin Desk",
      summary: "",
    });
    showToast("ਨਵਾਂ ਲੇਖ ਸਫਲਤਾਪੂਰਵਕ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ!");
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.sessionId.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      (s.clientIp && s.clientIp.includes(sessionSearch)) ||
      s.approxRegion.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.browser.toLowerCase().includes(sessionSearch.toLowerCase()) ||
      s.os.toLowerCase().includes(sessionSearch.toLowerCase())
  );

  const filteredArticles = articleList.filter(
    (a) =>
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.author.toLowerCase().includes(articleSearch.toLowerCase())
  );

  const adminUser = getAdminUser();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Brand />
            <span className="hidden sm:inline-block rounded-md bg-red-600 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-white uppercase">
              ADMIN PORTAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="size-3.5" /> Live Site <ExternalLink className="size-3" />
            </Link>

            <div className="flex items-center gap-2 border-l border-border pl-3">
              <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {adminUser?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden md:block text-xs text-left">
                <div className="font-bold text-foreground">{adminUser?.username || "Admin"}</div>
                <div className="text-[10px] text-muted-foreground">Administrator</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-3.5" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="border-t border-border bg-background">
          <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="size-4" /> Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab("sessions")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "sessions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="size-4" /> Recent Sessions & IPs
              {sessions.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {sessions.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "security"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldAlert className="size-4" /> IP Security & Blocklist
              {blockedIps.length > 0 && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0 bg-red-600">
                  {blockedIps.length} blocked
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("articles")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="size-4" /> Articles ({articleList.length})
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "categories"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="size-4" /> Categories ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "settings"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sliders className="size-4" /> Privacy & Retention
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Toast Alert Message */}
        {successMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 p-3.5 text-sm font-bold text-green-700 dark:text-green-400">
            <CheckCircle2 className="size-4.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & ANALYTICS DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "overview" && summary && (
          <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
                  <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                    <Users className="size-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
                  {summary.totalVisitors.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Activity className="size-3 text-green-600" />
                  <span>Privacy-consented sessions</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Now</span>
                  <div className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
                  {summary.activeSessionsNow}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">In last 15 minutes</div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Page Views</span>
                  <div className="grid size-8 place-items-center rounded-md bg-blue-500/10 text-blue-600">
                    <Eye className="size-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
                  {summary.totalPageViews.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ~{summary.avgPagesPerSession} pages / session
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Blocked IPs</span>
                  <div className="grid size-8 place-items-center rounded-md bg-red-500/10 text-red-600">
                    <Ban className="size-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-black text-foreground">
                  {blockedIps.length}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Firewall active</div>
              </div>
            </div>

            {/* Breaking News Performance Banner */}
            <div className="rounded-xl border-2 border-red-500/30 bg-gradient-to-r from-red-600/10 via-background to-background p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-red-600 text-white shadow shrink-0">
                    <Flame className="size-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      TOP TRENDING ARTICLE (ਅੱਜ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਪੜ੍ਹੀ ਗਈ ਖ਼ਬਰ)
                    </span>
                    <h3 className="text-base font-black text-foreground mt-0.5">
                      {summary.topArticles[0]?.title || "ਵੱਡੀ ਖ਼ਬਰ : ਗੁਲਾਬ ਸਿੱਧੂ ਦੇ ਘਰ 'ਤੇ ਫਾਇਰਿੰਗ ਕਰਨ ਵਾਲੇ ਸ਼ੂਟਰਾਂ ਦਾ ਐਨਕਾਊਂਟਰ"}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="default" className="bg-red-600 font-bold">
                    {summary.topArticles[0]?.views || 345} Views
                  </Badge>
                  <Link
                    to="/newslink"
                    className="inline-flex items-center gap-1 rounded-sm border border-input bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted"
                  >
                    View Page <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Traffic Timeline Chart */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-foreground flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    Visitors & Page Views Today
                  </h3>
                  <Badge variant="outline" className="text-xs">Live Trend</Badge>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summary.timelineData}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stop-color="#DC2626" stop-opacity={0.8} />
                          <stop offset="95%" stop-color="#DC2626" stop-opacity={0} />
                        </linearGradient>
                        <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stop-color="#2563EB" stop-opacity={0.8} />
                          <stop offset="95%" stop-color="#2563EB" stop-opacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="time" textAnchor="end" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        name="Page Views"
                        stroke="#DC2626"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        name="Visitors"
                        stroke="#2563EB"
                        fillOpacity={1}
                        fill="url(#colorVis)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-foreground flex items-center gap-2">
                    <PieIcon className="size-4 text-primary" />
                    Traffic Sources (ਟ੍ਰੈਫਿਕ ਦੇ ਸਰੋਤ)
                  </h3>
                  <span className="text-xs text-muted-foreground">Aggregated</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summary.trafficSources}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        fontSize={11}
                      >
                        {summary.trafficSources.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Device Category Breakdown */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-foreground flex items-center gap-2">
                    <Smartphone className="size-4 text-primary" />
                    Device Distribution
                  </h3>
                  <span className="text-xs text-muted-foreground">Mobile vs Desktop</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.deviceBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" name="Visitors" fill="#DC2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Geographical / Regional Distribution */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-base text-foreground flex items-center gap-2">
                    <Globe className="size-4 text-primary" />
                    Reader Geography (ਖੇਤਰੀ ਵੰਡ)
                  </h3>
                  <span className="text-xs text-muted-foreground">Safe Timezone/Region</span>
                </div>
                <div className="space-y-3 pt-2">
                  {summary.regionDistribution.map((reg, idx) => (
                    <div key={reg.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{reg.name}</span>
                        <span className="text-muted-foreground">{reg.value} sessions</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(
                              100,
                              (reg.value / (summary.totalVisitors || 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Most Read Articles Table */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-black text-base text-foreground mb-4 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                ਸਭ ਤੋਂ ਵੱਧ ਪੜ੍ਹੀਆਂ ਗਈਆਂ ਖ਼ਬਰਾਂ (Most Read Articles)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-border text-muted-foreground uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Article Title</th>
                      <th className="py-2.5 px-3">URL Path</th>
                      <th className="py-2.5 px-3 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {summary.topArticles.map((art, idx) => (
                      <tr key={art.path} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-muted-foreground">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-foreground">
                          <Link to={art.path} className="hover:text-primary transition-colors">
                            {art.title}
                          </Link>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-muted-foreground">
                          {art.path}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-primary">
                          {art.views}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: RECENT SESSIONS & IP LOGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground">
                  Recent Visitor Sessions & IP Access Logs
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  View visitor sessions, IP addresses, network details, and block unwanted traffic with 1-click.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Input
                    placeholder="Search session or IP..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="h-9 text-xs pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                </div>
                <Button size="sm" variant="outline" onClick={loadData} className="h-9 gap-1 text-xs">
                  <RefreshCw className="size-3.5" /> Refresh
                </Button>
              </div>
            </div>

            {/* Sessions Table with IP Column & Block Button */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border uppercase text-[10px] font-bold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">Session ID</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Approx Region</th>
                      <th className="py-3 px-4">Device & OS</th>
                      <th className="py-3 px-4">Pages</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSessions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-muted-foreground">
                          No active sessions found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredSessions.map((sess) => {
                        const clientIp = sess.clientIp || "103.217.158.45";
                        const blocked = isIpBlocked(clientIp);
                        return (
                          <tr key={sess.sessionId} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-foreground">
                              {sess.sessionId}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-foreground">
                                <span>{clientIp}</span>
                                {blocked && (
                                  <Badge variant="destructive" className="text-[9px] py-0 px-1 bg-red-600">
                                    Blocked
                                  </Badge>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {sess.maskedIp || "103.217.***.***"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              <div>{new Date(sess.lastActivity).toLocaleTimeString()}</div>
                              <div className="text-[10px]">{new Date(sess.lastActivity).toLocaleDateString()}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-foreground">{sess.approxRegion}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {sess.deviceCategory === "Mobile" ? (
                                  <Smartphone className="size-3 text-primary" />
                                ) : sess.deviceCategory === "Tablet" ? (
                                  <Tablet className="size-3 text-primary" />
                                ) : (
                                  <Laptop className="size-3 text-primary" />
                                )}
                                <span>{sess.deviceCategory}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground">{sess.os}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="font-mono text-[11px]">
                                {sess.pageCount} views
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={blocked ? "destructive" : "default"}
                                className="text-[10px]"
                              >
                                {blocked ? "Blocked" : "Active"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedSession(sess)}
                                  className="h-7 text-xs"
                                >
                                  Details
                                </Button>
                                {blocked ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUnblockIp(clientIp)}
                                    className="h-7 text-xs text-green-600 border-green-600/30 hover:bg-green-600/10"
                                  >
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleBlockIp(clientIp, "Blocked from session logs")}
                                    className="h-7 text-xs gap-1 bg-red-600 hover:bg-red-700"
                                    title="Block this IP address"
                                  >
                                    <Ban className="size-3" /> Block IP
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB: IP SECURITY & BLOCKLIST */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  <ShieldAlert className="size-5 text-red-600" />
                  IP Security & Firewall Blocklist (ਅਣਚਾਹੇ ਟ੍ਰੈਫਿਕ ਅਤੇ IP ਬਲਾਕਿੰਗ)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Protect TadkaNewz from spam bots, malicious scraping, and unwanted automated traffic by blocking abusive IP addresses.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Block New IP Form Card */}
              <div className="lg:col-span-1 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 font-black text-base text-foreground">
                  <Ban className="size-4.5 text-red-600" />
                  <span>Block an IP Address</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter an IPv4 or IPv6 address to instantly deny access across the website.
                </p>

                <form onSubmit={handleManualBlockSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                      Target IP Address:
                    </label>
                    <Input
                      required
                      placeholder="e.g. 198.51.100.42"
                      value={newBlockIp}
                      onChange={(e) => setNewBlockIp(e.target.value)}
                      className="font-mono text-xs h-10"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">
                      Reason for Block:
                    </label>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                    >
                      <option value="Suspicious automated scraping">Suspicious automated scraping / Bot</option>
                      <option value="Rate limit violation">Excessive requests / Rate limit violation</option>
                      <option value="Unwanted bot network">Unwanted bot traffic / Spam</option>
                      <option value="Abusive comments/requests">Abusive comments / Malicious requests</option>
                      <option value="Manual administrator block">Manual administrator block</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 text-xs font-bold bg-red-600 hover:bg-red-700 text-white gap-1.5"
                  >
                    <Ban className="size-3.5" /> Add to Blocklist (ਬਲਾਕ ਕਰੋ)
                  </Button>
                </form>
              </div>

              {/* Blocked IPs Table */}
              <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="font-black text-sm text-foreground flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    Currently Blocked IPs ({blockedIps.length})
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono">Active Firewall Rules</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b border-border uppercase text-[10px] font-bold text-muted-foreground">
                      <tr>
                        <th className="py-2.5 px-4">Blocked IP</th>
                        <th className="py-2.5 px-4">Reason</th>
                        <th className="py-2.5 px-4">Blocked At</th>
                        <th className="py-2.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {blockedIps.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-muted-foreground">
                            No blocked IPs in the blacklist. All legitimate traffic is allowed.
                          </td>
                        </tr>
                      ) : (
                        blockedIps.map((b) => (
                          <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-red-600 dark:text-red-400">
                              {b.ip}
                            </td>
                            <td className="py-3 px-4 text-foreground font-medium">{b.reason}</td>
                            <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                              {new Date(b.blockedAt).toLocaleDateString()} {new Date(b.blockedAt).toLocaleTimeString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockIp(b.ip)}
                                className="h-7 text-xs text-green-600 hover:bg-green-600/10 border-green-600/30 font-bold"
                              >
                                Unblock
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Real-time Security Access Stream */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-foreground flex items-center gap-2">
                    <Radio className="size-4 text-green-600 animate-pulse" />
                    Live Security Access Stream & Traffic Audits
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Real-time access logs with client IP resolution and firewall decisions.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Live Traffic</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border uppercase text-[10px] font-bold text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-4">Client IP</th>
                      <th className="py-2.5 px-4">Requested URL</th>
                      <th className="py-2.5 px-4">Region</th>
                      <th className="py-2.5 px-4">Time</th>
                      <th className="py-2.5 px-4">Firewall Decision</th>
                      <th className="py-2.5 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {securityLogs.map((log) => {
                      const blocked = isIpBlocked(log.ip);
                      return (
                        <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-foreground">
                            {log.ip}
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground">
                            {log.path}
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">
                            {log.countryOrRegion}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={blocked || log.status === "Blocked" ? "destructive" : "default"}
                              className="text-[10px]"
                            >
                              {blocked || log.status === "Blocked" ? "Blocked (403)" : "Allowed (200)"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {blocked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockIp(log.ip)}
                                className="h-7 text-xs text-green-600 border-green-600/30"
                              >
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBlockIp(log.ip, "Blocked from Live Stream")}
                                className="h-7 text-xs gap-1 bg-red-600 hover:bg-red-700"
                              >
                                <Ban className="size-3" /> Block
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: ARTICLES & STORIES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-foreground">
                  ਖ਼ਬਰਾਂ ਅਤੇ ਸਮੱਗਰੀ ਪ੍ਰਬੰਧਨ (Articles & Stories)
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage published articles, breaking news posts, and blog contributions.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Input
                    placeholder="Search news..."
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    className="h-9 text-xs pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewArticleModal(true)}
                  className="h-9 gap-1.5 text-xs font-bold bg-primary text-primary-foreground"
                >
                  <Plus className="size-4" /> New Article
                </Button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-muted/40 border-b border-border uppercase text-[11px] font-bold text-muted-foreground">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredArticles.map((story) => (
                      <tr key={story.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground line-clamp-1 max-w-md">
                            {story.title}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {story.summary}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-bold text-primary">
                            {story.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-foreground font-medium">{story.author}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{story.date}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400">
                            <CheckCircle2 className="size-3" /> Published
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={story.id === 0 ? "/newslink" : "/$category/$slug"}
                            params={{ category: story.categorySlug, slug: story.slug }}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            View <ExternalLink className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: CATEGORIES */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-foreground">
                ਸ਼੍ਰੇਣੀਆਂ ਅਤੇ ਸੰਪਾਦਕੀ ਸੈਕਸ਼ਨ (Categories)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Active news categories configured across TadkaNewz portal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => {
                const count = articleList.filter((a) => a.categorySlug === cat.slug).length;
                return (
                  <div
                    key={cat.slug}
                    className="rounded-xl border border-border bg-card p-5 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-black text-foreground">{cat.name}</h3>
                      <p className="font-mono text-xs text-muted-foreground mt-0.5">
                        slug: /{cat.slug}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-bold text-xs">
                        {count} articles
                      </Badge>
                      <div className="mt-1">
                        <Link
                          to="/category/$category"
                          params={{ category: cat.slug }}
                          target="_blank"
                          className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          Visit <ExternalLink className="size-2.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: PRIVACY & DATA RETENTION SETTINGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-foreground">
                ਪਰਦੇਦਾਰੀ ਅਤੇ ਡਾਟਾ ਰਿਟੈਂਸ਼ਨ ਸੈਟਿੰਗਜ਼ (Privacy & Data Retention)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Configure GDPR/ePrivacy compliant data retention policies and audit logs.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Retention Policy Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 font-black text-base text-foreground">
                  <Shield className="size-5 text-primary" />
                  <span>Analytics Retention Policy</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Analytics data older than this threshold is automatically deleted upon pruning. No perpetual visitor profiles are stored.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Retention Period:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 90, 180].map((days) => (
                      <button
                        key={days}
                        onClick={() => handleRetentionChange(days)}
                        className={`rounded-lg border p-3 text-center transition-all ${
                          retentionDays === days
                            ? "border-primary bg-primary/10 font-bold text-primary"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-lg font-black">{days} Days</div>
                        <div className="text-[10px]">
                          {days === 30 ? "Recommended" : days === 90 ? "Quarterly" : "Semi-Annual"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex flex-wrap gap-2 justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      pruneOldSessions();
                      loadData();
                      showToast("ਮਿਆਦ ਪੁੱਗੇ ਸੈਸ਼ਨਾਂ ਦੀ ਛਾਂਟੀ ਕੀਤੀ ਗਈ।");
                    }}
                    className="text-xs"
                  >
                    Prune Expired Sessions Now
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearData}
                    className="text-xs gap-1"
                  >
                    <Trash2 className="size-3.5" /> Clear All Analytics Data
                  </Button>
                </div>
              </div>

              {/* Security & Audit Logs Card */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-base text-foreground">
                    <Clock className="size-5 text-primary" />
                    <span>Security & Audit Log</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {auditLogs.length} entries
                  </Badge>
                </div>

                <div className="h-64 overflow-y-auto space-y-2 rounded-lg border border-border p-3 bg-muted/20 text-xs">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-md border border-border/60 bg-background p-2.5 shadow-2xs"
                    >
                      <div className="flex justify-between font-bold text-foreground">
                        <span>{log.action}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Session Details Modal */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-black">
                <Users className="size-4.5 text-primary" />
                Session Details: {selectedSession.sessionId}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Session network profile and page activity trail.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Client IP Address
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedSession.clientIp || "103.217.158.45"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Approximate Region
                  </span>
                  <span className="font-bold text-foreground">{selectedSession.approxRegion}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Device / OS
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedSession.deviceCategory} • {selectedSession.os}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                    Browser
                  </span>
                  <span className="font-bold text-foreground">{selectedSession.browser}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Pages Viewed ({selectedSession.pagesViewed.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1.5 border border-border rounded-lg p-2.5 bg-background">
                  {selectedSession.pagesViewed.map((pv, i) => (
                    <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-border/40 last:border-0">
                      <div className="truncate max-w-[260px] font-medium text-foreground">
                        {pv.title || pv.path}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {new Date(pv.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-row items-center justify-between sm:justify-between gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleBlockIp(selectedSession.clientIp || "103.217.158.45", "Blocked from detail view");
                  setSelectedSession(null);
                }}
                className="gap-1 text-xs bg-red-600"
              >
                <Ban className="size-3.5" /> Block This IP
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Article Modal */}
      <Dialog open={showNewArticleModal} onOpenChange={setShowNewArticleModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <form onSubmit={handleAddArticle}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-black">
                <FileText className="size-4.5 text-primary" />
                ਨਵੀਂ ਖ਼ਬਰ ਸ਼ਾਮਲ ਕਰੋ (Create New Article)
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new post to the TadkaNewz portal catalog.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div>
                <label className="font-bold text-foreground mb-1 block">Title (ਸਿਰਲੇਖ)</label>
                <Input
                  required
                  placeholder="ਖ਼ਬਰ ਦਾ ਸਿਰਲੇਖ ਇੱਥੇ ਲਿਖੋ..."
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-foreground mb-1 block">Category (ਸ਼੍ਰੇਣੀ)</label>
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs"
                    value={newArticle.categorySlug}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.slug === e.target.value);
                      setNewArticle({
                        ...newArticle,
                        categorySlug: e.target.value,
                        category: selected?.name || "ਪੰਜਾਬ",
                      });
                    }}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground mb-1 block">Author (ਲੇਖਕ)</label>
                  <Input
                    placeholder="Author name"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground mb-1 block">Summary (ਸੰਖੇਪ ਵੇਰਵਾ)</label>
                <textarea
                  placeholder="ਖ਼ਬਰ ਦਾ ਛੋਟਾ ਵੇਰਵਾ..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs min-h-[80px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowNewArticleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-bold">
                Publish Article
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
