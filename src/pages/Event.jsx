import VenueMap from "../sections/VenueMap";

export default function Event() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70 text-stone-800 pt-50">
      {/* heading */}
      <section className="text-center px-2">
        <p className="uppercase tracking-[0.3em] text-stone-800 text-md">
          Wedding Celebration
        </p>

        <h1 className="mt-1 text-5xl md:text-6xl font-bold font-['Playfair_Display']">
          Event Details
        </h1>

        <center>
          <p className="mt-6 max-w-3xl mx-auto text-stone-800 leading-relaxed">
            We are honored to celebrate this beautiful day with our family and
            friends. Here are the details for our wedding ceremony and
            reception.
          </p>
        </center>
      </section>

      {/* cards */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8">
        {/* ceremony */}
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10">
          <p className="uppercase tracking-widest text-stone-800 text-sm">
            Ceremony
          </p>

          <h2 className="mt-4 text-3xl font-bold font-['Playfair_Display']">
            Our Lady of Lourdes Parish
          </h2>

          <div className="mt-6 space-y-3 text-stone-600">
            <p>📅 June 25, 2026</p>

            <p>🕐 2:00 PM</p>

            <p>
              📍 4X64+GXC, Tagaytay - Nasugbu Hwy, Silang Junction North,
              Tagaytay City, Cavite
            </p>
          </div>
        </div>

        {/* reception */}
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10">
          <p className="uppercase tracking-widest text-stone-800 text-sm">
            Reception
          </p>

          <h2 className="mt-4 text-3xl font-bold font-['Playfair_Display']">
            The Grand Garden Hall
          </h2>

          <div className="mt-6 space-y-3 text-stone-600">
            <p>🍷 Dinner & Celebration</p>

            <p>🕔 5:00 PM</p>

            <p>📍 Garden Avenue, Quezon City</p>
          </div>
        </div>
      </section>

      {/* dress code */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-rose-100/70 rounded-3xl p-10 text-center">
          <p className="uppercase tracking-widest text-stone-800 text-sm">
            Dress Code
          </p>

          <h2 className="mt-4 text-3xl font-bold font-['Playfair_Display']">
            Formal Attire
          </h2>

          <p className="mt-6 text-stone-600 leading-relaxed">
            We kindly ask our guests to wear elegant formal attire in soft
            neutral or pastel tones to celebrate this special day.
          </p>
        </div>
      </section>

      {/* venue map */}
      <section className="pb-24">
        <VenueMap />
      </section>
    </main>
  );
}
