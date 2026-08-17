import { motion } from "framer-motion";
import { Wifi, Armchair, Snowflake, Mouse, Tag } from "lucide-react";
import { whyChooseUs } from "../data/content";

const ICONS: Record<string, React.ElementType> = { Wifi, Armchair, Snowflake, Mouse, Tag };

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-24 md:py-32 px-5 md:px-10 bg-bg overflow-hidden">
      <motion.h2
        className="max-w-6xl mx-auto text-center font-heading text-3xl md:text-5xl font-bold gradient-text mb-16 md:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        WHY CHOOSE US
      </motion.h2>

      <div className="max-w-3xl mx-auto relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple via-cyan to-pink md:-translate-x-1/2" />

        <div className="space-y-10 md:space-y-14">
          {whyChooseUs.map((item, i) => {
            const Icon = ICONS[item.icon];
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center gap-5 md:gap-0 pl-16 md:pl-0 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full glass flex items-center justify-center neon-box-cyan`}
                >
                  <Icon size={20} color="#00C2FF" />
                </div>
                <div className={`md:w-1/2 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <h3 className="font-heading text-base md:text-xl font-bold text-white hover:text-cyan transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
