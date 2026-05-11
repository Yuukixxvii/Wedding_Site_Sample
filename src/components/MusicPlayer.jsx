import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(new Audio("/Dilaw.mp3"));
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    const audio = audioRef.current;
    audio.loop = true;

    if (!playing) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-[999] px-5 py-3 rounded-full bg-white/70 backdrop-blur-xl shadow-xl"
    >
      {playing ? "🔊 Pause Music" : "🎵 Play Music"}
    </button>
  );
}
