import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/story", label: "Story" },
    { path: "/gallery", label: "Gallery" },
    { path: "/event", label: "Event" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* logo */}
        <h1 className="text-2xl font-bold text-rose-500 font-['Playfair_Display']">
          Mark & Jane
        </h1>

        {/* links */}
        <div className="flex gap-8 text-sm uppercase tracking-widest">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className="relative group">
                {/* text */}
                <span
                  className={`transition-colors duration-300 ${
                    isActive ? "text-rose-500 font-semibold" : "text-stone-700"
                  }`}
                >
                  {item.label}
                </span>

                {/* animated underline */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-rose-400 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
