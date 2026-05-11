import { motion } from "framer-motion";

const timeline = [
  {
    year: "2020",
    title: "We met",
    text: "Two strangers, one unexpected moment.",
  },
  {
    year: "2021",
    title: "First date",
    text: "A simple coffee that changed everything.",
  },
  {
    year: "2023",
    title: "We grew together",
    text: "Through highs, lows, and endless laughter.",
  },
  {
    year: "2025",
    title: "Engagement",
    text: "A promise for forever ❤️",
  },
];

export default function LoveStory() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <h2 className="text-4xl text-center mb-16">Our Love Story</h2>

      <div className="relative border-l-2 border-rose-200 pl-6 space-y-12">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* dot */}
            <div className="absolute -left-3 top-2 w-4 h-4 bg-rose-500 rounded-full"></div>

            <div className="bg-white/70 backdrop-blur-xl p-6 rounded-xl shadow-md">
              <h3 className="text-rose-600 font-semibold">{item.year}</h3>
              <h4 className="text-xl font-bold mt-1">{item.title}</h4>
              <p className="mt-2 text-gray-600">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
