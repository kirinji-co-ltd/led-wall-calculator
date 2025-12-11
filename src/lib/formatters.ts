/**
 * Number formatting utilities for LED Wall Calculator
 */

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ja-JP');
}

/**
 * Format dimensions (width x height)
 */
export function formatDimensions(width: number, height: number, unit: string = ''): string {
  return `${formatNumber(width)} × ${formatNumber(height)}${unit ? ` ${unit}` : ''}`;
}

/**
 * Format resolution with total pixels
 */
export function formatResolution(width: number, height: number): string {
  const total = width * height;
  return `${formatDimensions(width, height, 'px')} (${formatNumber(total)}ピクセル)`;
}

/**
 * Format physical size in meters with original mm values
 */
export function formatPhysicalSize(widthMm: number, heightMm: number): {
  meters: string;
  millimeters: string;
} {
  const widthM = (widthMm / 1000).toFixed(2);
  const heightM = (heightMm / 1000).toFixed(2);
  return {
    meters: `${widthM} × ${heightM} m`,
    millimeters: `${formatNumber(widthMm)} × ${formatNumber(heightMm)} mm`,
  };
}

/**
 * Format area in square meters
 */
export function formatArea(area: number): string {
  return `${area.toFixed(2)} m²`;
}

/**
 * Format viewing distance in meters
 */
export function formatDistance(meters: number): string {
  return `${meters.toFixed(1)} m`;
}

/**
 * Format cost in Japanese Yen
 */
export function formatCurrency(amount: number): string {
  return `¥${formatNumber(amount)}`;
}

/**
 * Format pixel density
 */
export function formatPixelDensity(density: number): string {
  return `${formatNumber(density)} ピクセル/m²`;
}

/**
 * Calculate aspect ratio and format as string
 */
export function formatAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const divisor = gcd(width, height);
  const aspectWidth = width / divisor;
  const aspectHeight = height / divisor;
  
  return `${aspectWidth}:${aspectHeight}`;
}

/**
 * Format panel count with grid dimensions
 */
export function formatPanelCount(total: number, width: number, height: number): string {
  return `${formatNumber(total)}枚 (${width} × ${height})`;
}
