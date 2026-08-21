import { motion } from "framer-motion";
import { CheckCircle2, Ticket } from "lucide-react";
import { useSettings } from "../hooks/useTaxonomy";

export default function MembershipBenefits() {
  const settings = useSettings();
  const title = settings.membershipTitle.trim() || "MEMBERSHIP BENEFITS";
  const description =
    settings.membershipDescription.trim() ||
    "Join the community and unlock perks made for regular gamers, families, and coffee runs.";
  const benefits =
    settings.membershipBenefits.length > 0
      ? settings.membershipBenefits
      : [
          "Discounted hourly gaming rates",
          "Priority booking for busy weekends",
          "Exclusive member offers on food and drinks",
        ];

  return (
    <section id="membership" className="relative py-14 md:py-28 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 md:gap-8 items-stretch"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
      >
        <div className="glass rgb-border rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-purple/10 pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-[11px] font-heading tracking-[0.18em] text-cyan">
              <Ticket size={12} />
              VIP ACCESS
            </span>

            <h2 className="mt-4 font-heading text-3xl md:text-5xl font-bold gradient-text leading-tight">
              {title}
            </h2>

            <p className="mt-4 max-w-xl text-sm md:text-base text-white/65 font-body leading-relaxed">
              {description}
            </p>

            <div className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan">
                    <CheckCircle2 size={16} />
                  </span>
                  <p className="text-sm md:text-base text-white/80 font-body leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
