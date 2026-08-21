import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useGallery } from "../hooks/useGallery";

export default function Gallery() {
  const images = useGallery();
  const [active, setActive] = useState<string | null>(null);
  const activeImage = images.find((img) => img.id === active) || null;

  return (
    <section id="gallery" className="relative py-14 md:py-32 px-5 md:px-10 bg-bg">
      <motion.h2
        className="max-w-6xl mx-auto text-center font-heading text-3xl md:text-5xl font-bold gradient-text mb-8 md:mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        GALLERY
      </motion.h2>

      {images.length === 0 ? (
        <p className="text-center text-white/40 font-body text-sm">
          Photos coming soon — check back after our next event.
        </p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              onClick={() => setActive(img.id)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 8) * 0.06 }}
              className="group relative rounded-xl overflow-hidden glass rgb-border aspect-[4/5] text-left"
              data-cursor-hover
            >
              <img
                src={img.url}
                alt={img.caption || "Techno Cafe"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {img.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="font-heading text-xs md:text-sm text-white translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    {img.caption}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative max-w-sm w-full rounded-2xl overflow-hidden rgb-border glass"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close"
                onClick={() => setActive(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full glass text-white/80 hover:text-cyan"
              >
                <X size={18} />
              </button>
              <img
                src={activeImage.url}
                alt={activeImage.caption || "Techno Cafe"}
                className="w-full aspect-[4/5] object-cover"
              />
              {activeImage.caption && (
                <p className="p-4 font-heading text-sm text-white">{activeImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
