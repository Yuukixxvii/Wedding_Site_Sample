export default function Footer() {
  return (
    <footer className="border-t-3 border-gray-800 bg-gradient-to-b from-black/20 via-rose-900/30 to-[#2d1f1f]/70">
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        {/* names */}
        <h2 className="text-3xl md:text-4xl font-bold text-black font-['Playfair_Display']">
          Mark & Jane
        </h2>

        {/* wedding date */}
        <p className="mt-3 text-stone-800 tracking-widest uppercase text-sm">
          June 25, 2026
        </p>
        <br />
        {/* romantic message */}
        <center>
          <p className="mt-6 max-w-xl mx-auto text-stone-800 leading-relaxed">
            Thank you for being part of our journey and celebrating this special
            moment with us. We can’t wait to share our forever with the people
            we love most.
          </p>
        </center>

        {/* divider */}
        <div className="w-50 h-px bg-stone-800 mx-auto mt-5"></div>

        {/* copyright */}
        <p className="text-xs text-stone-800">With love, forever & always ✨</p>
      </div>
    </footer>
  );
}
