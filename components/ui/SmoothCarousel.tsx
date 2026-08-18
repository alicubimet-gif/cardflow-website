"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAP = 28;

export default function SmoothCarousel({
  children,
  autoPlayMs = 5000,
  className = "",
  startIndex = 0,
}: {
  children: React.ReactNode;
  autoPlayMs?: number;
  className?: string;
  startIndex?: number;
}) {
  const items = React.Children.toArray(children).filter(Boolean);
  const count = items.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const x = useMotionValue(0);
  const busy = useRef(false);
  const indexRef = useRef(0);
  const startRef = useRef(startIndex);

  useEffect(() => {
    startRef.current = startIndex;
  }, [startIndex]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const slideW = viewportW
    ? viewportW >= 1024
      ? Math.min(viewportW * 0.42, 420)
      : viewportW >= 768
        ? Math.min(viewportW * 0.58, 460)
        : viewportW
    : 0;
  const step = slideW + GAP;
  const origin = viewportW && slideW ? (viewportW - slideW) / 2 : 0;
  const loop = count > 1;
  const track = loop ? [...items, ...items, ...items] : items;
  const base = loop ? count : 0;

  const xFor = useCallback(
    (i: number) => origin - i * step,
    [origin, step],
  );

  useEffect(() => {
    if (!slideW) return;
    const preferred = ((startRef.current % Math.max(count, 1)) + Math.max(count, 1)) % Math.max(count, 1);
    const next = loop ? base + preferred : preferred;
    setIndex(next);
    x.set(xFor(next));
    setReady(true);
  }, [base, count, loop, slideW, startIndex, x, xFor]);

  const slideTo = useCallback(
    (next: number) => {
      if (!slideW || busy.current) return;
      busy.current = true;
      setIndex(next);
      animate(x, xFor(next), {
        type: "spring",
        stiffness: 62,
        damping: 20,
        mass: 0.85,
      }).then(() => {
        if (loop) {
          let wrapped = next;
          if (next >= count * 2) wrapped = next - count;
          if (next < count) wrapped = next + count;
          if (wrapped !== next) {
            setIndex(wrapped);
            x.set(xFor(wrapped));
          }
        }
        busy.current = false;
      });
    },
    [count, loop, slideW, x, xFor],
  );

  const go = useCallback(
    (dir: number) => {
      if (count <= 1) return;
      slideTo(indexRef.current + dir);
    },
    [count, slideTo],
  );

  useEffect(() => {
    if (paused || !loop) return;
    const id = window.setInterval(() => go(1), autoPlayMs);
    return () => window.clearInterval(id);
  }, [autoPlayMs, go, loop, paused]);

  if (count === 0) return null;

  const activeDot = loop ? ((index % count) + count) % count : index;

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative">
        <div
          ref={viewportRef}
          className="overflow-hidden"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 280ms ease" }}
        >
          <motion.div className="flex items-stretch" style={{ x, gap: GAP }}>
            {track.map((child, i) => {
              const real = i % count;
              const distance = Math.abs(i - index);
              const dim = loop ? distance > 0 : false;
              return (
                <div
                  key={`${real}-${i}`}
                  className="min-w-0 shrink-0 transition-[opacity,transform] duration-500"
                  style={{
                    width: slideW || "100%",
                    opacity: !slideW ? 1 : dim ? 0.45 : 1,
                    transform: dim ? "scale(0.94)" : "scale(1)",
                  }}
                >
                  <div className="h-full">{child}</div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {loop ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white sm:left-0 sm:-translate-x-1/2 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white sm:right-0 sm:translate-x-1/2 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => slideTo(loop ? base + i : i)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                activeDot === i
                  ? "w-8 bg-blue-600 dark:bg-blue-400"
                  : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
