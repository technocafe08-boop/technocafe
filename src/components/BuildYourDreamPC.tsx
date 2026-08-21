import { motion } from "framer-motion";
import { Settings, Wallet, Gamepad2, MessageCircle } from "lucide-react";
import MagneticButton from "./MagneticButton";
import PCIllustration from "./PCIllustration";
import { buildWhatsAppLink } from "../lib/settingsStore";

const points = [
  {
    icon: Settings,
    title: "CUSTOM BUILDS",
    desc: "Built around your requirements.",
  },
  {
    icon: Wallet,
    title: "BUDGET FRIENDLY",
    desc: "Choose the right components for your budget.",
  },
  {
    icon: Gamepad2,
    title: "GAMING READY",
    desc: "Optimized for the games you actually play.",
  },
];

export default function BuildYourDreamPC() {
  function handleWhatsApp() {
    window.open(
      buildWhatsAppLink(
        "Hi Techno Cafe! I'm interested in building a custom PC. I'd like to discuss my budget and requirements."
      ),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section id="build-pc" className="relative py-14 md:py-32 px-5 md:px-10 bg-bg overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 items-center">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="order-2 md:order-1"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold gradient-text leading-tight">
            BUILD YOUR DREAM PC.
          </h2>
          <p className="mt-4 text-white/60 font-body text-sm md:text-base max-w-md">
            Custom gaming PCs built around your budget, performance needs, and favorite games.
          </p>

          <div className="mt-9 space-y-6">
            {points.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex items-start gap-4"
              >
                <span className="shrink-0 w-11 h-11 rounded-full glass flex items-center justify-center neon-box-cyan">
                  <p.icon size={19} color="#00C2FF" />
                </span>
                <div>
                  <h3 className="font-heading text-sm md:text-base font-bold tracking-wide text-white">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-white/60 text-xs md:text-sm font-body">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <p className="font-heading text-sm md:text-base text-purple neon-purple mb-4">
              Starting from your budget — let's build it.
            </p>
            <MagneticButton
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 font-heading tracking-[0.15em] text-sm font-bold px-8 py-4 rounded-full text-black bg-gradient-to-r from-cyan to-purple neon-box-cyan min-h-[48px] w-full xs:w-auto"
            >
              <MessageCircle size={18} />
              WHATSAPP US →
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Right: illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="order-1 md:order-2"
        >
          <PCIllustration />
        </motion.div>
      </div>
    </section>
  );
}
