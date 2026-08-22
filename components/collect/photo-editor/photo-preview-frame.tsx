import { useCallback, useRef } from "react";

import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  previewWidth: number;
  previewHeight: number;
  borderRadius: string;
  cameraActive: boolean;
  source: string | null;
  canvasReady: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onZoomChange: (zoom: number) => void;
  onOffsetChange: (x: number, y: number) => void;
};

export function PhotoPreviewFrame({
  previewWidth,
  previewHeight,
  borderRadius,
  cameraActive,
  source,
  canvasReady,
  videoRef,
  previewCanvasRef,
  zoom,
  offsetX,
  offsetY,
  onZoomChange,
  onOffsetChange,
}: Props) {
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  const clampOffset = useCallback((x: number, y: number) => {
    return {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!source || cameraActive) return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offsetX,
      oy: offsetY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = (event.clientX - dragRef.current.x) / previewWidth;
    const dy = (event.clientY - dragRef.current.y) / previewHeight;
    const next = clampOffset(dragRef.current.ox + dx * 2, dragRef.current.oy - dy * 2);
    onOffsetChange(next.x, next.y);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!source || cameraActive) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.06 : 0.06;
    onZoomChange(Math.max(1, Math.min(2.5, zoom + delta)));
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      pinchRef.current = { distance, zoom };
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 2 || !pinchRef.current) return;
    const [a, b] = [event.touches[0], event.touches[1]];
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const scale = distance / pinchRef.current.distance;
    onZoomChange(Math.max(1, Math.min(2.5, pinchRef.current.zoom * scale)));
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  return (
    <div
      className={cn(
        "relative grid touch-none place-items-center overflow-hidden bg-muted/40 ring-1 ring-border/60",
        source && !cameraActive && "cursor-grab active:cursor-grabbing",
      )}
      style={{
        width: previewWidth,
        height: previewHeight,
        borderRadius,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {cameraActive ? (
        <video ref={videoRef} autoPlay playsInline muted className="size-full object-cover" />
      ) : source ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={source}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity",
              canvasReady ? "opacity-0" : "opacity-100",
            )}
          />
          <canvas
            ref={previewCanvasRef}
            className="relative z-[1] block size-full"
            aria-label="Photo crop preview"
          />
        </>
      ) : (
        <div className="grid size-full place-items-center bg-muted/30 text-muted-foreground">
          <UserRound className="size-16 opacity-45" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}
