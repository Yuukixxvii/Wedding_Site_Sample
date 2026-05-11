export default function VenueMap() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">
      {/* heading */}
      <p className="uppercase tracking-[0.3em] text-stone-800 text-sm">
        Wedding Venue
      </p>

      <h2 className="mt-4 text-5xl font-bold font-['Playfair_Display']">
        Our Lady of Lourdes Parish
      </h2>

      <center>
        <p className="mt-6 text-stone-800 max-w-2xl mx-auto">
          We are excited to celebrate our special day together surrounded by
          love, family, and friends.
        </p>
      </center>

      {/* map */}
      <div className="mt-12 rounded-3xl overflow-hidden shadow-2xl border border-white/30">
        <iframe
          className="w-full h-[500px]"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247436.290643216!2d120.73693312636672!3d14.300271892650397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd7764459f8ce3%3A0xe729ecd446058e72!2sOur%20Lady%20of%20Lourdes%20Parish!5e0!3m2!1sen!2sph!4v1778492520574!5m2!1sen!2sph"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* venue details */}
      <div className="mt-10">
        <p className="text-lg text-white">Tagaytay City, Philippines</p>

        <p className="mt-2 text-gray-200">Ceremony begins at 2:00 PM</p>
      </div>
    </section>
  );
}
