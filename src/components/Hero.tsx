import { useState, useEffect } from "react";

const slides = [
  { src: "/equipe.jpeg" },
  { src: "/bureau.jpeg" },
  { src: "/men.jpg" },
  { src: "/negoce.jpeg" },
  { src: "/tes rêves.jpeg" }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-7 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-xl shadow-lg">
        {/* Wrapper slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)`, width: `${slides.length * 100}%` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              {/* Image */}
              <div className="w-full h-[50vh] md:h-[70vh] overflow-hidden">
                <img
                  src={slide.src}
                  alt={slide.src}
                  className="w-300 h-150 object-cover"
                />
              </div>
              {/* Overlay texte */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4 sm:p-6 md:p-8 text-white">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold">Bienvenue</h2>
                <p className="mt-1 sm:mt-2 md:mt-3 text-sm sm:text-base md:text-lg">Trouvez un stage ou un emploi facilement</p>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons précédent / suivant */}
        <button
          onClick={() => setCurrent(current === 0 ? slides.length - 1 : current - 1)}
          className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-gray-600 z-10"
        >‹</button>
        <button
          onClick={() => setCurrent(current === slides.length - 1 ? 0 : current + 1)}
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-gray-600 z-10"
        >›</button>

        {/* Indicateurs */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${index === current ? "bg-blue-600" : "bg-gray-400"}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
