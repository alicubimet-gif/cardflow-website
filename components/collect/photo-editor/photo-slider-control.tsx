import type { ReactNode } from "react";

import { Slider } from "@/components/ui/Slider";
import { formatSliderValue } from "@/lib/photo-adjustments";

export function PhotoSliderControl({
  label,
  icon,
  value,
  min,
  max,
  step,
  formatValue,
  onChange,
}: {
  label: string;
  icon?: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const display = formatValue ? formatValue(value) : formatSliderValue(value);
  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {icon}
          {label}
        </p>
        <span className="tabular-nums text-xs font-semibold text-foreground">{display}</span>
      </div>
      <Slider
        className="min-h-10"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}
