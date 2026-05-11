import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/story", label: "Story" },
    { path: "/gallery", label: "Gallery" },
    { path: "/event", label: "Event" },
  ];

  // 👇 close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <h1 className="text-xl md:text-7xl font-bold text-rose-500 font-['Playfair_Display']">
          Mark & Jane
        </h1>

        {/* desktop menu */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className="relative group">
                {/* text */}
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-rose-500 font-semibold"
                      : "text-stone-700 group-hover:text-rose-500"
                  }`}
                >
                  {item.label}
                </span>

                {/* animated underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-rose-400 transition-all duration-300 ease-in-out ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 py-6 flex flex-col gap-4 bg-white/30 backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`text-sm uppercase tracking-widest ${
                location.pathname === item.path
                  ? "text-rose-500 font-semibold"
                  : "text-stone-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
