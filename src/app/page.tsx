"use client";

import PillCursor from "@/components/PillCursor";

const cards = [
  {
    title: "Snow Summit",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
    pillText: "View Product",
    pillColor: "#000000",
    pillTextColor: "#ffffff",
  },
  {
    title: "Trail Runner",
    image:
      "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=600&h=800&fit=crop",
    pillText: "Shop Now",
    pillColor: "#ea580c",
    pillTextColor: "#000000",
  },
  {
    title: "Kinetic Athletics",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=800&fit=crop",
    pillText: "View Event",
    pillColor: "#7dd3d8",
    pillTextColor: "#000000",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <PillCursor />

      {/* Card grid — each card triggers the pill */}
      <section className="px-8 pt-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-zinc-900 mb-8">
          Hover Over Each Card!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              data-pill-cursor
              data-pill-text={card.pillText}
              data-pill-color={card.pillColor}
              data-pill-text-color={card.pillTextColor}
              className="relative overflow-hidden rounded-2xl aspect-[3/4] group"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-semibold">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
