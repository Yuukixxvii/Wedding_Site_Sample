import { useEffect } from "react";

export default function MusicPlayer() {
  useEffect(() => {
    const audio = new Audio("/Dilaw.mp3");
    audio.loop = true;
    audio.play().catch(() => {});
  }, []);

  return null;
}
