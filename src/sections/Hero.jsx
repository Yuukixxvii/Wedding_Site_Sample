import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen pt-40 overflow-hidden md:text-md">
      {/* soft floral overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70"></div>

      {/* blurred glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-rose-300/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl"></div>

      {/* content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="uppercase tracking-[0.5em] text-xs md:text-md text-rose-100"
        >
          Together With Their Families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4 }}
          className="mt-6 text-6xl md:text-8xl font-bold font-['Playfair_Display'] drop-shadow-2xl"
        >
          Mark & Jane
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full shadow-2xl"
        >
          <p className="tracking-[0.2em] uppercase text-sm text-rose-50">
            June 25, 2026
          </p>
        </motion.div>

        {/* buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href="/Letter.pdf"
            download
            className="px-8 py-4 rounded-full bg-rose-500/80 hover:bg-rose-600 transition shadow-2xl backdrop-blur-xl hover:text-black"
          >
            Download Invitation
          </a>

          <Link
            to="/event"
            className="px-8 py-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition backdrop-blur-xl hover:text-black"
          >
            View Event
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
