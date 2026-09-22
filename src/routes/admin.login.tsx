import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/news/brand";
import { loginAdmin, isAuthenticatedAdmin, checkLockout } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Login — TadkaNewz" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticatedAdmin()) {
      navigate({ to: "/admin" });
    }
    const { locked, remainingSeconds } = checkLockout();
    if (locked) {
      setLockoutSec(remainingSeconds);
    }
  }, [navigate]);

  useEffect(() => {
    if (lockoutSec <= 0) return;
    const timer = setInterval(() => {
      setLockoutSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(username, password);
      if (result.success) {
        navigate({ to: "/admin" });
      } else {
        setError(result.message);
        const { locked, remainingSeconds } = checkLockout();
        if (locked) {
          setLockoutSec(remainingSeconds);
        }
      }
    } catch {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-muted/40 via-background to-background">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-3.5" /> ਮੁੱਖ ਪੰਨੇ ਉੱਤੇ ਵਾਪਸ ਜਾਓ (Back to Website)
          </Link>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            PORTAL SECURE
          </span>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border-2 border-border bg-card p-6 sm:p-8 shadow-xl">
          <div className="text-center pb-6 border-b border-border">
            <div className="inline-flex justify-center mb-3">
              <Brand />
            </div>
            <h1 className="text-xl font-black text-foreground mt-1">
              Admin & Analytics Dashboard
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              ਸੁਰੱਖਿਅਤ ਪ੍ਰਬੰਧਕੀ ਪੋਰਟਲ ਵਿੱਚ ਲੌਗਇਨ ਕਰੋ
            </p>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {lockoutSec > 0 && (
            <div className="mt-5 rounded-md bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-700 dark:text-amber-400 font-medium">
              ਸੁਰੱਖਿਆ ਕਾਰਨਾਂ ਕਰਕੇ ਅਸਥਾਈ ਤੌਰ 'ਤੇ ਲਾਕ ਆਊਟ ਕੀਤਾ ਗਿਆ ਹੈ: {lockoutSec} ਸਕਿੰਟ
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Username
              </label>
              <div className="relative">
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-9 h-11 text-sm bg-background"
                  disabled={lockoutSec > 0 || loading}
                />
                <User className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9 h-11 text-sm bg-background"
                  disabled={lockoutSec > 0 || loading}
                />
                <Lock className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={lockoutSec > 0 || loading}
              className="w-full h-11 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              {loading ? "Verifying..." : "Login to Dashboard"}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          </form>

          {/* Privacy & Security Note */}
          <div className="mt-6 pt-5 border-t border-border/70 text-[11px] text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
              <Shield className="size-3.5 text-primary" />
              <span>Security & Environment Notice</span>
            </div>
            <p>
              Credentials can be configured via <code>ADMIN_USERNAME</code> and <code>ADMIN_PASSWORD</code> environment variables in your deployment settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
