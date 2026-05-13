import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";

import LoginForm from "./LoginForm";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/story", label: "Story" },
    { path: "/gallery", label: "Gallery" },
    { path: "/event", label: "Event" },
    { path: "/rsvp", label: "RSVP" },
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
    const handleScroll = () => {
      if (showLogin) {
        setShowLogin(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showLogin]);

  useEffect(() => {
    setOpen(false);
    setShowLogin(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/20 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <h1 className="text-xl md:text-7xl font-bold text-rose-500 font-['Playfair_Display']">
          Mark & Jane
        </h1>

        {/* desktop menu */}
        <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest">
          {navItems
            .filter((item) => !item.hidden)
            .map((item) => {
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
          <Link
            onClick={() => {
              if (auth.currentUser) {
                window.location.href = "/admin";
              } else {
                setShowLogin(true);
              }
            }}
            className="text-md opacity-40 hover:opacity-100 transition cursor-pointer"
          >
            Admin
          </Link>
        </div>

        {/* mobile button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl">
          ☰
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 py-6 flex flex-col gap-4 bg-white/30 backdrop-blur-xl">
          {navItems
            .filter((item) => !item.hidden)
            .map((item) => (
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
          <Link
            onClick={() => {
              setOpen(false);

              if (auth.currentUser) {
                window.location.href = "/admin";
              } else {
                setShowLogin(true);
              }
            }}
            className="text-md opacity-40 hover:opacity-100 transition cursor-pointer"
          >
            Admin
          </Link>
        </div>
      )}

      {showLogin && (
        <div
          onClick={() => setShowLogin(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-xl px-4 pt-28"
        >
          {/* MODAL CARD */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-stone-200/95 hover:bg-stone-300 rounded-2xl shadow-2xl animate-[slideDown_0.35s_ease-out]"
          >
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>

          {/* ANIMATION */}
          <style>
            {`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
          </style>
        </div>
      )}
    </nav>
  );
}
