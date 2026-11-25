import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "../auth-context";

export function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/portal");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#07140F" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#F2EFE7" }}>NDI Portal</h1>
          <p className="mt-2 text-sm" style={{ color: "#F2EFE7", opacity: 0.6 }}>Niger Delta Institute of Digital Technology</p>
        </div>

        <div className="rounded-xl border p-8" style={{ background: "#0D2119", borderColor: "rgba(242,239,231,0.1)" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#F2EFE7" }}>Sign in to your account</h2>

          {error && (
            <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className="w-full h-10 rounded-md border px-3 text-sm outline-none transition-colors placeholder:opacity-40"
                style={{ background: "rgba(242,239,231,0.05)", borderColor: "rgba(242,239,231,0.15)", color: "#F2EFE7" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password"
                className="w-full h-10 rounded-md border px-3 text-sm outline-none transition-colors placeholder:opacity-40"
                style={{ background: "rgba(242,239,231,0.05)", borderColor: "rgba(242,239,231,0.15)", color: "#F2EFE7" }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-10 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: "#FF6A2B", color: "#fff" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(242,239,231,0.1)" }}>
            <p className="text-sm text-center" style={{ color: "#F2EFE7", opacity: 0.6 }}>
              Don't have an account?{" "}
              <Link href="/portal/register" className="font-medium" style={{ color: "#FF6A2B" }}>Create one</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#F2EFE7", opacity: 0.3 }}>
          <Link href="/" style={{ color: "inherit" }}>&larr; Back to website</Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required."); return;
    }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register({ email, password, firstName, lastName, role: "student" });
      navigate("/portal");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "rgba(242,239,231,0.05)",
    borderColor: "rgba(242,239,231,0.15)",
    color: "#F2EFE7",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#07140F" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#F2EFE7" }}>NDI Portal</h1>
          <p className="mt-2 text-sm" style={{ color: "#F2EFE7", opacity: 0.6 }}>Create your student account</p>
        </div>

        <div className="rounded-xl border p-8" style={{ background: "#0D2119", borderColor: "rgba(242,239,231,0.1)" }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: "#F2EFE7" }}>Register</h2>

          {error && (
            <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>First name</label>
                <input
                  type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amara" autoComplete="given-name"
                  className="w-full h-10 rounded-md border px-3 text-sm outline-none placeholder:opacity-40"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Last name</label>
                <input
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="Okafor" autoComplete="family-name"
                  className="w-full h-10 rounded-md border px-3 text-sm outline-none placeholder:opacity-40"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className="w-full h-10 rounded-md border px-3 text-sm outline-none placeholder:opacity-40"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Password</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters" autoComplete="new-password"
                className="w-full h-10 rounded-md border px-3 text-sm outline-none placeholder:opacity-40"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#F2EFE7", opacity: 0.8 }}>Confirm password</label>
              <input
                type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password" autoComplete="new-password"
                className="w-full h-10 rounded-md border px-3 text-sm outline-none placeholder:opacity-40"
                style={inputStyle}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full h-10 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              style={{ background: "#FF6A2B", color: "#fff" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(242,239,231,0.1)" }}>
            <p className="text-sm text-center" style={{ color: "#F2EFE7", opacity: 0.6 }}>
              Already have an account?{" "}
              <Link href="/portal/login" className="font-medium" style={{ color: "#FF6A2B" }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#F2EFE7", opacity: 0.3 }}>
          <Link href="/" style={{ color: "inherit" }}>&larr; Back to website</Link>
        </p>
      </div>
    </div>
  );
}
