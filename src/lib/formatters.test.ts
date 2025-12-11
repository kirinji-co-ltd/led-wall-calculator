import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatDimensions,
  formatResolution,
  formatPhysicalSize,
  formatArea,
  formatDistance,
  formatCurrency,
  formatPixelDensity,
  formatAspectRatio,
  formatPanelCount,
} from './formatters';

describe('formatters', () => {
  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber(480000)).toBe('480,000');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(42)).toBe('42');
      expect(formatNumber(999)).toBe('999');
    });
  });

  describe('formatDimensions', () => {
    it('should format dimensions without unit', () => {
      expect(formatDimensions(800, 600)).toBe('800 × 600');
      expect(formatDimensions(1920, 1080)).toBe('1,920 × 1,080');
    });

    it('should format dimensions with unit', () => {
      expect(formatDimensions(800, 600, 'px')).toBe('800 × 600 px');
      expect(formatDimensions(2000, 1500, 'mm')).toBe('2,000 × 1,500 mm');
    });
  });

  describe('formatResolution', () => {
    it('should format resolution with total pixels', () => {
      expect(formatResolution(800, 600)).toBe('800 × 600 px (480,000ピクセル)');
      expect(formatResolution(1920, 1080)).toBe('1,920 × 1,080 px (2,073,600ピクセル)');
    });
  });

  describe('formatPhysicalSize', () => {
    it('should format physical size in meters and millimeters', () => {
      const result = formatPhysicalSize(2000, 1500);
      expect(result.meters).toBe('2.00 × 1.50 m');
      expect(result.millimeters).toBe('2,000 × 1,500 mm');
    });

    it('should handle decimal values', () => {
      const result = formatPhysicalSize(1234, 5678);
      expect(result.meters).toBe('1.23 × 5.68 m');
      expect(result.millimeters).toBe('1,234 × 5,678 mm');
    });
  });

  describe('formatArea', () => {
    it('should format area with 2 decimal places', () => {
      expect(formatArea(3)).toBe('3.00 m²');
      expect(formatArea(3.5)).toBe('3.50 m²');
      expect(formatArea(1.215)).toBe('1.22 m²');
    });
  });

  describe('formatDistance', () => {
    it('should format distance with 1 decimal place', () => {
      expect(formatDistance(2.5)).toBe('2.5 m');
      expect(formatDistance(7.0)).toBe('7.0 m');
      expect(formatDistance(20.0)).toBe('20.0 m');
    });

    it('should round to 1 decimal place', () => {
      expect(formatDistance(2.56)).toBe('2.6 m');
      expect(formatDistance(7.123)).toBe('7.1 m');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in Japanese Yen', () => {
      expect(formatCurrency(1200000)).toBe('¥1,200,000');
      expect(formatCurrency(8000000)).toBe('¥8,000,000');
      expect(formatCurrency(100000)).toBe('¥100,000');
    });

    it('should handle zero and small amounts', () => {
      expect(formatCurrency(0)).toBe('¥0');
      expect(formatCurrency(500)).toBe('¥500');
    });
  });

  describe('formatPixelDensity', () => {
    it('should format pixel density', () => {
      expect(formatPixelDensity(160000)).toBe('160,000 ピクセル/m²');
      expect(formatPixelDensity(443556)).toBe('443,556 ピクセル/m²');
    });
  });

  describe('formatAspectRatio', () => {
    it('should calculate and format aspect ratio', () => {
      expect(formatAspectRatio(800, 600)).toBe('4:3');
      expect(formatAspectRatio(1920, 1080)).toBe('16:9');
      expect(formatAspectRatio(1000, 1000)).toBe('1:1');
    });

    it('should handle non-standard ratios', () => {
      expect(formatAspectRatio(1200, 400)).toBe('3:1');
      expect(formatAspectRatio(400, 1200)).toBe('1:3');
    });

    it('should simplify ratios', () => {
      expect(formatAspectRatio(3200, 2400)).toBe('4:3');
      expect(formatAspectRatio(640, 480)).toBe('4:3');
    });
  });

  describe('formatPanelCount', () => {
    it('should format panel count with grid dimensions', () => {
      expect(formatPanelCount(12, 4, 3)).toBe('12枚 (4 × 3)');
      expect(formatPanelCount(80, 10, 8)).toBe('80枚 (10 × 8)');
    });

    it('should handle single panel', () => {
      expect(formatPanelCount(1, 1, 1)).toBe('1枚 (1 × 1)');
    });

    it('should format large numbers with separators', () => {
      expect(formatPanelCount(1000, 50, 20)).toBe('1,000枚 (50 × 20)');
    });
  });
});
