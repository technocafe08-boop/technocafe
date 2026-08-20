import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLogin from "./admin/AdminLogin";
import GamesTab from "./admin/GamesTab";
import TaxonomyTab from "./admin/TaxonomyTab";
import MenuTab from "./admin/MenuTab";
import GalleryTab from "./admin/GalleryTab";
import SettingsTab from "./admin/SettingsTab";
import StatsTab from "./admin/StatsTab";
import { adminAuth } from "../lib/adminAuth";

const TABS = [
  { id: "games", label: "Games" },
  { id: "taxonomy", label: "Categories" },
  { id: "menu", label: "Food Menu" },
  { id: "gallery", label: "Gallery" },
  { id: "stats", label: "Stats" },
  { id: "settings", label: "Settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(adminAuth.isLoggedIn());
  const [tab, setTab] = useState<TabId>("games");

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-bg text-white font-body">
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/60 hover:text-cyan transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to site
          </Link>
        </div>

        <h1 className="font-heading text-2xl md:text-4xl font-bold gradient-text">ADMIN PANEL</h1>
        <p className="mt-2 text-white/50 text-sm">
          Manage games, food menu, gallery photos, and WhatsApp contact. Changes go live
          immediately for every visitor.
        </p>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs md:text-sm font-heading tracking-wide transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-cyan to-purple text-black neon-box-cyan"
                  : "glass text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "games" && <GamesTab />}
          {tab === "taxonomy" && <TaxonomyTab />}
          {tab === "menu" && <MenuTab />}
          {tab === "gallery" && <GalleryTab />}
          {tab === "stats" && <StatsTab />}
          {tab === "settings" && <SettingsTab onLogout={() => setLoggedIn(false)} />}
        </div>
      </div>
    </div>
  );
}
