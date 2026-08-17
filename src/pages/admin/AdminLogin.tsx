import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import MagneticButton from "../../components/MagneticButton";
import { useSettings } from "../../hooks/useTaxonomy";
import { adminAuth } from "../../lib/adminAuth";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const settings = useSettings();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (adminAuth.login(password, settings.adminPassword)) {
      onSuccess();
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-bg text-white font-body flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm mb-8"
        >
          <ArrowLeft size={16} />
          Back to site
        </Link>

        <form onSubmit={handleSubmit} className="glass rgb-border rounded-2xl p-6 md:p-8">
          <div className="w-12 h-12 rounded-full glass neon-box-cyan flex items-center justify-center mb-5">
            <Lock size={20} color="#00C2FF" />
          </div>
          <h1 className="font-heading text-xl font-bold gradient-text">ADMIN LOGIN</h1>
          <p className="mt-2 text-white/50 text-sm">Enter the admin password to continue.</p>

          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Password"
            className="mt-5 w-full rounded-lg bg-white/5 border border-white/15 px-3.5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan"
          />
          {error && <p className="mt-2 text-pink text-xs">{error}</p>}

          <MagneticButton
            type="submit"
            className="mt-5 w-full flex items-center justify-center gap-2 font-heading tracking-[0.1em] text-sm font-bold px-6 py-3 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan min-h-[44px]"
          >
            LOG IN
          </MagneticButton>

          <p className="mt-4 text-white/30 text-[11px] leading-relaxed">
            Default password is <code className="text-white/50">technocafe123</code> until you
            change it under Settings.
          </p>
        </form>
      </div>
    </div>
  );
}
