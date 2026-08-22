"use client";

import { cn } from "@/lib/utils";

type SliderProps = {
  className?: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
};

export function Slider({ className, value, min, max, step, onValueChange }: SliderProps) {
  const current = value[0] ?? min;
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <div className="absolute h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={max}
      />
      <div
        className="pointer-events-none absolute h-4 w-4 rounded-full border border-primary/50 bg-background shadow"
        style={{ left: `calc(${percent}% - 8px)` }}
      />
    </div>
  );
}
