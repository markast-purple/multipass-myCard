/**
 * Derives a per-card glassmorphism color set by rotating the hue of the
 * primary color (#1a5c5c, hue ≈ 180°) by `hueStep * index` degrees.
 *
 * Returns CSS custom-property values suitable for inline style injection.
 */

const PRIMARY_HEX = "#1a5c5c";
// How many degrees to rotate the hue per card index
const HUE_STEP = 28;

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return [0, 0, l];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

const [BASE_H, BASE_S, BASE_L] = hexToHsl(PRIMARY_HEX);

export interface CardColorSet {
  /** Semi-transparent gradient start (CSS color string) */
  gradFrom: string;
  /** Gradient mid */
  gradVia: string;
  /** Gradient end */
  gradTo: string;
  /** Border color */
  border: string;
  /** Glow shadow */
  glow: string;
  /** Surface background (darkened version for containers) */
  surface: string;
}

/**
 * Returns a color set for card at `index`.
 * Each successive card shifts the hue by HUE_STEP degrees.
 */
export function getCardColors(index: number): CardColorSet {
  const h = (BASE_H + index * HUE_STEP) % 360;

  // Keep saturation rich but vary lightness slightly for depth
  const sFrom = Math.max(30, Math.min(70, BASE_S - index * 2));
  const lFrom = Math.max(12, Math.min(30, BASE_L - index));
  const lVia = Math.max(18, Math.min(38, BASE_L + 4 - index));
  const lTo = Math.max(8, Math.min(22, BASE_L - 6 - index));

  const gradFrom = `hsla(${h}, ${sFrom}%, ${lFrom}%, 0.85)`;
  const gradVia = `hsla(${h}, ${sFrom - 5}%, ${lVia}%, 0.75)`;
  const gradTo = `hsla(${(h + 15) % 360}, ${sFrom}%, ${lTo}%, 0.90)`;
  const border = `hsla(${h}, 80%, 80%, 0.20)`;
  const glow = `hsla(${h}, 60%, 40%, 0.30)`;
  const surface = `hsla(${h}, ${sFrom}%, ${Math.max(4, lFrom - 10)}%, 0.7)`;

  return { gradFrom, gradVia, gradTo, border, glow, surface };
}
