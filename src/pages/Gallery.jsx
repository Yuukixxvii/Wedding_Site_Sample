import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery() {
  const images = ["/logo.png", "/logo.png", "/logo.png"];

  const [selected, setSelected] = useState(null);

  return (
    <section className="py-24 text-center bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70">
      <h2 className="text-5xl font-bold text-white font-['Playfair_Display']">
        Our Moments
      </h2>

      <p className="mt-4 text-rose-100">Memories we’ll cherish forever</p>

      {/* gallery grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-16 max-w-6xl mx-auto">
        {images.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            onClick={() => setSelected(img)}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl cursor-pointer shadow-2xl border border-white/20"
          />
        ))}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={selected}
              className="max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
