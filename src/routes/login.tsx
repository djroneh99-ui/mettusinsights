import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/" });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      setLoading(false);
      return;
    }
    void navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left: branding panel ── */}
      <div
        className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden lg:flex"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.06 265) 0%, oklch(0.22 0.10 255) 50%, oklch(0.18 0.08 240) 100%)",
        }}
      >
        {/* Decorative glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.68 0.18 245), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-20 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.16 200), transparent 70%)" }}
        />

        {/* Logo + wordmark */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <img
            src="/Mettus  Icon.png"
            alt="Mettus"
            className="h-48 w-48 drop-shadow-2xl"
          />
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Mettus Insights
            </h1>
            <p className="text-lg text-white/60 font-light">
              Workforce Analytics Platform
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-white/40">
            <span>Analytics · Skills Planning · Rewards</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="absolute bottom-6 text-xs text-white/25">
          © {new Date().getFullYear()} Mettus. All rights reserved.
        </p>
      </div>

      {/* ── Right: login form ── */}
      <div className="flex w-full flex-col items-center justify-center bg-background px-8 lg:w-1/2">
        {/* Mobile logo (shown only below lg) */}
        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <img
            src="/Mettus  Icon.png"
            alt="Mettus"
            className="h-16 w-16"
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Mettus Insights</h1>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to access your workforce dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@mettus.co.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                className="h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
