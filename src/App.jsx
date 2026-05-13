import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Story from "./pages/Story";
import Gallery from "./pages/Gallery";
import Event from "./pages/Event";
import Rsvp from "./pages/Rsvp";
import Admin from "./pages/Admin";

import PageTransition from "./components/PageTransition";
import FloatingPetals from "./components/FloatingPetals";
import ScrollToTop from "./components/ScrollToTop";

function ProtectedAdmin({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  return user ? children : <Navigate to="/" />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        <Route
          path="/story"
          element={
            <PageTransition>
              <Story />
            </PageTransition>
          }
        />

        <Route
          path="/gallery"
          element={
            <PageTransition>
              <Gallery />
            </PageTransition>
          }
        />

        <Route
          path="/event"
          element={
            <PageTransition>
              <Event />
            </PageTransition>
          }
        />

        <Route
          path="/rsvp"
          element={
            <PageTransition>
              <Rsvp />
            </PageTransition>
          }
        />

        <Route
          path="/admin"
          element={
            <PageTransition>
              <ProtectedAdmin>
                <Admin />
              </ProtectedAdmin>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const location = useLocation();

  const hidePetals = location.pathname === "/admin";

  return (
    <div className="bg-amber-700/40 min-h-screen text-stone-800 overflow-x-hidden">
      <MusicPlayer />
      <Navbar />

      {!hidePetals && <FloatingPetals />}

      <AnimatedRoutes />
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
