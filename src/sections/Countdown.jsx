import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Countdown() {
  const weddingDate = new Date("2026-06-25T00:00:00");

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70">
      <div className="max-w-5xl mx-auto text-center">
        <p className="uppercase tracking-[0.3em] text-stone-900 text-md">
          Counting The Days
        </p>

        <h2 className="mt-4 text-5xl font-bold font-['Playfair_Display']">
          Until We Say “I Do”
        </h2>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/30"
            >
              <div className="text-5xl font-bold text-stone-800">
                {item.value}
              </div>

              <p className="mt-3 uppercase tracking-widest text-sm text-stone-700">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
