import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MusicPlayer from "./components/MusicPlayer";

import Home from "./pages/Home";
import Story from "./pages/Story";
import Gallery from "./pages/Gallery";
import Event from "./pages/Event";

import PageTransition from "./components/PageTransition";
import FloatingPetals from "./components/FloatingPetals";
import ScrollToTop from "./components/ScrollToTop";

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
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-amber-700/40 min-h-screen text-stone-800">
        <MusicPlayer />
        <Navbar />
        <FloatingPetals />
        <AnimatedRoutes />
        <ScrollToTop />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
