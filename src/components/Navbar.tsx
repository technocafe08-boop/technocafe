import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoIcon from "../assets/logo-icon.png";

const LINKS = [
  { label: "Setups", href: "#setups" },
  { label: "Games", href: "#games" },
  { label: "Menu", href: "#menu" },
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-4 bg-gradient-to-b from-bg/90 to-transparent">
        <span className="flex items-center gap-2 md:gap-3">
          <img src={logoIcon} alt="Techno Cafe" className="h-9 md:h-11 w-auto select-none" draggable={false} />
          <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-white">
            TECHNO<span className="text-cyan">.</span>CAFE
          </span>
        </span>

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
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-full glass"
          data-cursor-hover
        >
          {open ? <X size={22} color="#00C2FF" /> : <Menu size={22} color="#00C2FF" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg/98 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleLink(l.href)}
                className="font-heading text-2xl tracking-widest text-white active:text-cyan min-h-[48px]"
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
