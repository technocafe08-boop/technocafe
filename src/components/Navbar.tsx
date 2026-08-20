import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

const LINKS = [
  { label: "Upcoming", href: "#upcoming-games" },
  { label: "Games", href: "#games" },
  { label: "Food Menu", href: "#menu" },
  { label: "Setups", href: "#setups" },
  { label: "Build PC", href: "#build-pc" },
  { label: "Stats", href: "#stats" },
  { label: "Why Us", href: "#why-us" },
  { label: "Gallery", href: "#gallery" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  function handleLink(href: string) {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-3 md:px-10 pt-3">
        <nav>
          <div className="glass rgb-border relative flex items-center justify-between gap-4 rounded-3xl px-4 md:px-8 py-3 shadow-2xl shadow-black/25">
            <Link to="/" className="flex items-center gap-2 md:gap-3" aria-label="Techno Cafe home">
              <img src={logoIcon} alt="Techno Cafe" className="h-9 md:h-11 w-auto select-none" draggable={false} />
              <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-white">
                TECHNO<span className="text-cyan">.</span>CAFE
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => handleLink(l.href)}
                  className="text-sm tracking-wide text-white/80 hover:text-cyan transition-colors font-body"
                  data-cursor-hover
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden relative z-10 w-11 h-11 flex items-center justify-center rounded-full glass shadow-lg shadow-black/30"
              data-cursor-hover
            >
              {open ? <X size={22} color="#00C2FF" /> : <Menu size={22} color="#00C2FF" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex items-start justify-center bg-bg/80 px-5 pt-24 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div
              className="glass rgb-border w-full max-w-sm rounded-3xl p-6 shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-stretch gap-3">
                {LINKS.map((l, i) => (
                  <motion.button
                    key={l.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleLink(l.href)}
                    className="font-heading text-lg tracking-[0.24em] text-white/90 active:text-cyan min-h-[48px] rounded-2xl bg-black/20 border border-white/10 px-5 text-left hover:border-cyan/50 hover:bg-cyan/10 transition-colors"
                  >
                    {l.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
