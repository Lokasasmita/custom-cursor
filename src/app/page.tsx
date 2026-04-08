"use client";

import gsap from "gsap";
import PillCursor from "@/components/PillCursor";

const cards = [
  {
    title: "Mclaren",
    image: "/img2.jpg",
    pillText: "See Product",
    pillColor: "#000000",
    pillTextColor: "#ffffff",
  },
  {
    title: "Porsche",
    image: "/img5.jpg",
    pillText: "Buy Now",
    pillColor: "#ea580c",
    pillTextColor: "#000000",
  },
  {
    title: "Ferrari",
    image: "/img9.jpg",
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
      <section className="px-8 pt-40 max-w-6xl mx-auto">
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
              className="relative overflow-hidden rounded-xl aspect-[3/4] group"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 0.98,
                  duration: 0.3,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.3,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
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
