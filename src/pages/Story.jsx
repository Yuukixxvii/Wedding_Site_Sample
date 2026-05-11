import LoveStory from "../sections/LoveStory";

export default function Story() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70 text-stone-800 pt-50">
      {/* page heading */}
      <section className="text-center">
        <p className="uppercase tracking-[0.3em] text-stone-800 text-md">
          Our Journey
        </p>

        <h1 className="mt-4 text-5xl md:text-6xl font-bold font-['Playfair_Display']">
          Our Love Story
        </h1>

        <center>
          <p className="mt-6 max-w-2xl mx-auto text-stone-600 leading-relaxed">
            Every love story is beautiful, but ours is our favorite. From our
            first meeting to the moment we said forever — here are the memories
            that brought us together.
          </p>
        </center>
      </section>

      {/* timeline section */}
      <LoveStory />
    </main>
  );
}
