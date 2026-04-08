"use client";

import Image from "next/image";
import gsap from "gsap";
import CustomCursor from "@/components/CustomCursor";

const cards = [
  {
    title: "McLaren",
    image: "/img2.jpg",
    cursorText: "See Product",
    cursorColor: "#000000",
    cursorTextColor: "#ffffff",
  },
  {
    title: "Porsche",
    image: "/img5.jpg",
    cursorText: "Buy Now",
    cursorColor: "#ea580c",
    cursorTextColor: "#000000",
  },
  {
    title: "Ferrari",
    image: "/img9.jpg",
    cursorText: "View Details",
    cursorColor: "#7dd3d8",
    cursorTextColor: "#000000",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f0f0f0]">
      <CustomCursor />

      {/* Card grid — each card triggers the label */}
      <section className="px-8 pt-40 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-zinc-900 mb-8">
          Hover Over Each Card
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              data-cursor-label
              data-cursor-text={card.cursorText}
              data-cursor-color={card.cursorColor}
              data-cursor-text-color={card.cursorTextColor}
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
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
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
