import { FaInstagram, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import logoIcon from "../assets/logo-icon.png";

const LINKS = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/technocafejpg?igsh=aXM3dWV4Z2p2YWV6" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/919609788672" },
  { icon: FaMapMarkerAlt, label: "Google Maps", href: "https://share.google/XRItS9Y4xBsuSDkMp" },
];

const CONTACT = [
  {
    label: "Address",
    value: "Opposite Samaj Para Puja Ground, Samaj Para, Dinbazar, Jalpaiguri-735101, West Bengal",
    href: "https://share.google/XRItS9Y4xBsuSDkMp",
  },
  {
    label: "Phone",
    value: "+91 96097 88672",
    href: "tel:+919609788672",
  },
  {
    label: "Email",
    value: "technocafe08@gmail.com",
    href: "mailto:technocafe08@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="relative py-12 px-5 border-t border-white/10 bg-bg">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
        <span className="flex items-center gap-2">
          <img src={logoIcon} alt="Techno Cafe" className="h-10 w-auto select-none" draggable={false} />
          <span className="font-heading text-lg font-bold tracking-widest text-white">
            TECHNO<span className="text-cyan">.</span>CAFE
          </span>
        </span>

        <div className="flex gap-6">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label}
              className="w-11 h-11 flex items-center justify-center rounded-full glass text-white/70 hover:text-cyan hover:neon-box-cyan transition-all"
              data-cursor-hover
            >
              <l.icon size={18} />
            </a>
          ))}
        </div>

        <div className="w-full max-w-3xl grid gap-4 sm:grid-cols-3">
          {CONTACT.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === "Address" ? "_blank" : undefined}
              rel={item.label === "Address" ? "noopener noreferrer" : undefined}
              className="glass rounded-xl px-4 py-3 text-center text-sm text-white/80 hover:text-white transition-colors"
            >
              <span className="block text-xs uppercase tracking-[0.2em] text-white/40">{item.label}</span>
              <span className="mt-1 block leading-snug">{item.value}</span>
            </a>
          ))}
        </div>

        <p className="text-white/40 text-xs font-body text-center">
          &copy; {new Date().getFullYear()} Techno Cafe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
