import { useCallback, useMemo, useRef } from "react";

import type { CurvePoint } from "@/lib/photo-adjustments";
import { cn } from "@/lib/utils";

const SIZE = 220;
const PAD = 16;

function toSvg(points: CurvePoint[]) {
  return points
    .slice()
    .sort((a, b) => a.x - b.x)
    .map((p) => {
      const x = PAD + p.x * (SIZE - PAD * 2);
      const y = SIZE - PAD - p.y * (SIZE - PAD * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

export function PhotoCurveEditor({
  points,
  onChange,
}: {
  points: CurvePoint[];
  onChange: (points: CurvePoint[]) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const polyline = useMemo(() => toSvg(points), [points]);

  const dragPoint = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = Math.max(PAD, Math.min(SIZE - PAD, ((clientX - rect.left) / rect.width) * SIZE));
      const y = Math.max(PAD, Math.min(SIZE - PAD, ((clientY - rect.top) / rect.height) * SIZE));
      const nx = (x - PAD) / (SIZE - PAD * 2);
      const ny = 1 - (y - PAD) / (SIZE - PAD * 2);
      const next = points.map((p, i) => {
        if (i !== index) return p;
        if (index === 0) return { x: 0, y: ny };
        if (index === points.length - 1) return { x: 1, y: ny };
        return { x: Math.max(0.05, Math.min(0.95, nx)), y: ny };
      });
      onChange(next);
    },
    [onChange, points],
  );

  return (
    <div className="rounded-2xl bg-muted/40 p-3">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto block w-full max-w-[240px] touch-none select-none"
        aria-label="Luminance curve"
      >
        <defs>
          <pattern id="curveGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={SIZE} height={SIZE} fill="url(#curveGrid)" className="text-foreground" rx="12" />
        <line
          x1={PAD}
          y1={SIZE - PAD}
          x2={SIZE - PAD}
          y2={PAD}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="1"
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          points={polyline}
        />
        {points.map((p, index) => {
          const cx = PAD + p.x * (SIZE - PAD * 2);
          const cy = SIZE - PAD - p.y * (SIZE - PAD * 2);
          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={index === 0 || index === points.length - 1 ? 7 : 9}
              className={cn(
                "fill-primary stroke-background stroke-2",
                index === 0 || index === points.length - 1 ? "cursor-ns-resize" : "cursor-grab",
              )}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                const move = (e: PointerEvent) => dragPoint(index, e.clientX, e.clientY);
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
            />
          );
        })}
      </svg>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Drag points to adjust overall luminance. Corner points lock to the edges.
      </p>
    </div>
  );
}
