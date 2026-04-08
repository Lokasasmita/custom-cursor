"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface PillCursorConfig {
  /** Size of the dot when not hovering a trigger (px) */
  dotSize?: number;
  /** Height of the pill when expanded (px) */
  pillHeight?: number;
  /** Horizontal padding inside the pill (px) */
  pillPaddingX?: number;
  /** Duration for the mouse-follow smoothing — lower = snappier */
  followDuration?: number;
  /** Duration of the pop/shrink morph animation */
  morphDuration?: number;
  /** Default pill background color */
  defaultColor?: string;
  /** Default pill text color */
  defaultTextColor?: string;
  /** Z-index of the cursor element */
  zIndex?: number;
}

/**
 * PillCursor — a custom cursor that morphs into a pill over `[data-pill-cursor]` elements.
 *
 * Place once in your layout. Mark trigger sections with:
 *   data-pill-cursor
 *   data-pill-text="View Product"
 *   data-pill-color="#000"
 *   data-pill-text-color="#fff"
 */
export default function PillCursor({
  dotSize = 12,
  pillHeight = 36,
  pillPaddingX = 20,
  followDuration = 0.35,
  morphDuration = 0.35,
  defaultColor = "#ea580c",
  defaultTextColor = "#fff",
  zIndex = 9999,
}: PillCursorConfig) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = cursorRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;

    // ── state ──────────────────────────────────────────
    let expanded = false;
    let activeTrigger: HTMLElement | null = null;

    // ── initial style ──────────────────────────────────
    gsap.set(el, {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      opacity: 0,
      scale: 0,
      xPercent: -50,
      yPercent: -110,
      backgroundColor: defaultColor,
    });
    gsap.set(textEl, { opacity: 0, scale: 0 });

    // ── smooth follow ──────────────────────────────────
    const xTo = gsap.quickTo(el, "x", {
      duration: followDuration,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: followDuration,
      ease: "power3.out",
    });
    const rotTo = gsap.quickTo(el, "rotation", {
      duration: 0.6,
      ease: "power2.out",
    });

    // ── velocity tracking for wiggle ──────────────────
    let prevX = 0;
    let prevTime = 0;
    const maxRotation = 10; // degrees

    // ── helpers ────────────────────────────────────────
    function findTrigger(target: EventTarget | null): HTMLElement | null {
      if (!target || !(target instanceof HTMLElement)) return null;
      return target.closest("[data-pill-cursor]") as HTMLElement | null;
    }

    function expandTo(trigger: HTMLElement) {
      if (!textEl) return;
      activeTrigger = trigger;
      expanded = true;

      const text = trigger.dataset.pillText || "";
      const bgColor = trigger.dataset.pillColor || defaultColor;
      const txtColor = trigger.dataset.pillTextColor || defaultTextColor;

      textEl.textContent = text;

      // measure text to calculate pill width
      const measure = textEl.cloneNode(true) as HTMLSpanElement;
      measure.style.cssText =
        "position:absolute;visibility:hidden;white-space:nowrap;font-size:13px;font-weight:500;letter-spacing:0.02em";
      document.body.appendChild(measure);
      measure.textContent = text;
      const textWidth = measure.offsetWidth;
      document.body.removeChild(measure);

      const pillWidth = text ? textWidth + pillPaddingX * 2 : pillHeight;

      // pop open — snappy with mild overshoot (no elastic width bounce)
      gsap.to(el, {
        width: pillWidth,
        height: pillHeight,
        borderRadius: pillHeight / 2,
        backgroundColor: bgColor,
        opacity: 1,
        scale: 1,
        duration: morphDuration,
        ease: "back.out(0.4)",
        overwrite: "auto",
      });

      gsap.to(textEl, {
        opacity: 1,
        scale: 1,
        color: txtColor,
        duration: morphDuration,
        ease: "back.out(0.4)",
        overwrite: "auto",
      });
    }

    function hidePill() {
      activeTrigger = null;
      expanded = false;

      gsap.to(textEl, {
        opacity: 0,
        scale: 0,
        duration: morphDuration * 0.5,
        ease: "power2.in",
        overwrite: "auto",
      });

      gsap.to(el, {
        width: dotSize,
        height: dotSize,
        borderRadius: dotSize / 2,
        scale: 0,
        opacity: 0,
        duration: morphDuration * 0.5,
        ease: "power2.in",
        overwrite: "auto",
      });
    }

    // ── mouse move ─────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      xTo(e.clientX);
      yTo(e.clientY);

      // velocity-based wiggle rotation
      const now = performance.now();
      const dt = now - prevTime;
      if (dt > 0 && prevTime > 0) {
        const vx = (e.clientX - prevX) / dt; // px/ms
        const rot = Math.max(-maxRotation, Math.min(maxRotation, vx * 18));
        rotTo(rot);
      }
      prevX = e.clientX;
      prevTime = now;
    }

    // ── mouse over ─────────────────────────────────────
    function onMouseOver(e: MouseEvent) {
      const trigger = findTrigger(e.target);
      if (!trigger) return;

      // already expanded on this same trigger
      if (expanded && activeTrigger === trigger) return;

      // different trigger — morph to new config
      expandTo(trigger);
    }

    // ── mouse out ──────────────────────────────────────
    function onMouseOut(e: MouseEvent) {
      const fromTrigger = findTrigger(e.target);
      if (!fromTrigger) return;

      const toTrigger = findTrigger(e.relatedTarget);

      // moving to another trigger — let onMouseOver handle it
      if (toTrigger && toTrigger !== fromTrigger) return;

      // staying in same trigger (child → child)
      if (toTrigger === fromTrigger) return;

      // truly leaving — shrink and hide
      hidePill();
    }

    // ── mouse leaves viewport ──────────────────────────
    function onMouseLeave() {
      expanded = false;
      activeTrigger = null;
      gsap.set(el, { opacity: 0, scale: 0 });
      gsap.set(textEl, { opacity: 0, scale: 0 });
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [
    dotSize,
    pillHeight,
    pillPaddingX,
    followDuration,
    morphDuration,
    defaultColor,
    defaultTextColor,
  ]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform, width, height",
      }}
    >
      <span
        ref={textRef}
        style={{
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.02em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
