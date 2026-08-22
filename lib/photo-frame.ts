/** Photo slot geometry from a card design document (mm). */

export interface PhotoFrame {
  widthMm: number;
  heightMm: number;
  radiusMm: number;
  aspect: number;
}

const DEFAULT_PHOTO_RADIUS_MM = 3;

const DEFAULT_FRAME: PhotoFrame = {
  widthMm: 22,
  heightMm: 22,
  radiusMm: DEFAULT_PHOTO_RADIUS_MM,
  aspect: 1,
};

function isPhotoLayer(layer: Record<string, unknown>): boolean {
  const kind = String(layer.__fe_kind || "");
  const type = String(layer.type || "");
  if (kind === "dynamic-image" || kind === "photo") return true;
  if (type === "photo") return true;
  if (type === "image" && layer.binding) return true;
  return false;
}

function clampRadius(radiusMm: number, widthMm: number, heightMm: number) {
  return Math.max(0, Math.min(radiusMm, Math.min(widthMm, heightMm) / 2));
}

export function extractPhotoFrame(document: Record<string, unknown> | null | undefined): PhotoFrame {
  if (!document) return { ...DEFAULT_FRAME };

  const sides = (document.sides || {}) as Record<string, { layers?: unknown[] }>;
  const order = ["front", "back", ...Object.keys(sides)];
  const seen = new Set<string>();

  for (const side of order) {
    if (seen.has(side)) continue;
    seen.add(side);
    const layers = sides[side]?.layers || [];
    for (const raw of layers) {
      if (!raw || typeof raw !== "object") continue;
      const layer = raw as Record<string, unknown>;
      if (!isPhotoLayer(layer)) continue;
      const frame = (layer.frame || {}) as Record<string, unknown>;
      const widthMm = Math.max(Number(frame.w_mm) || DEFAULT_FRAME.widthMm, 1);
      const heightMm = Math.max(Number(frame.h_mm) || DEFAULT_FRAME.heightMm, 1);
      const rawRadius =
        layer.corner_radius_mm != null ? Number(layer.corner_radius_mm) : DEFAULT_PHOTO_RADIUS_MM;
      return {
        widthMm,
        heightMm,
        radiusMm: clampRadius(rawRadius, widthMm, heightMm),
        aspect: widthMm / heightMm,
      };
    }
  }

  return { ...DEFAULT_FRAME };
}

export function frameBorderRadiusCss(frame: PhotoFrame, previewWidthPx: number): string {
  if (frame.radiusMm <= 0 || frame.widthMm <= 0) return "0px";
  const px = (frame.radiusMm / frame.widthMm) * previewWidthPx;
  return `${px.toFixed(2)}px`;
}

export function photoPreviewSize(frame: PhotoFrame, maxSide = 280): { width: number; height: number } {
  const aspect = Math.max(frame.aspect || 1, 0.2);
  if (aspect >= 1) {
    return { width: maxSide, height: Math.max(1, Math.round(maxSide / aspect)) };
  }
  return { width: Math.max(1, Math.round(maxSide * aspect)), height: maxSide };
}
