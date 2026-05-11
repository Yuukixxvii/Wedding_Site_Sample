import { useEffect, useState } from "react";

export default function FloatingPetals() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      size: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));

    setPetals(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute text-rose-300/60"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animation: `fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}
