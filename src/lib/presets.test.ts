/**
 * Unit tests for Preset utilities
 */

import { describe, it, expect } from 'vitest';
import { defaultPresets, getCategoryLabel, getPresetsByCategory, findPresetById } from './presets';

describe('Preset Utilities', () => {
  describe('defaultPresets', () => {
    it('should have at least 10 default presets', () => {
      expect(defaultPresets.length).toBeGreaterThanOrEqual(10);
    });

    it('should have presets from all three categories', () => {
      const categories = new Set(defaultPresets.map(p => p.category));
      expect(categories.has('panel-size')).toBe(true);
      expect(categories.has('pitch')).toBe(true);
      expect(categories.has('use-case')).toBe(true);
    });

    it('should have valid panel dimensions', () => {
      defaultPresets.forEach(preset => {
        expect(preset.panelWidth).toBeGreaterThan(0);
        expect(preset.panelHeight).toBeGreaterThan(0);
        expect(preset.ledPitch).toBeGreaterThan(0);
      });
    });

    it('should have unique IDs', () => {
      const ids = defaultPresets.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should not be marked as custom', () => {
      defaultPresets.forEach(preset => {
        expect(preset.isCustom).toBeUndefined();
      });
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for panel-size', () => {
      expect(getCategoryLabel('panel-size')).toBe('パネルサイズ');
    });

    it('should return correct label for pitch', () => {
      expect(getCategoryLabel('pitch')).toBe('ピッチ');
    });

    it('should return correct label for use-case', () => {
      expect(getCategoryLabel('use-case')).toBe('用途');
    });
  });

  describe('getPresetsByCategory', () => {
    it('should filter presets by panel-size category', () => {
      const panelSizePresets = getPresetsByCategory(defaultPresets, 'panel-size');
      expect(panelSizePresets.length).toBeGreaterThan(0);
      panelSizePresets.forEach(preset => {
        expect(preset.category).toBe('panel-size');
      });
    });

    it('should filter presets by pitch category', () => {
      const pitchPresets = getPresetsByCategory(defaultPresets, 'pitch');
      expect(pitchPresets.length).toBeGreaterThan(0);
      pitchPresets.forEach(preset => {
        expect(preset.category).toBe('pitch');
      });
    });

    it('should filter presets by use-case category', () => {
      const useCasePresets = getPresetsByCategory(defaultPresets, 'use-case');
      expect(useCasePresets.length).toBeGreaterThan(0);
      useCasePresets.forEach(preset => {
        expect(preset.category).toBe('use-case');
      });
    });

    it('should return empty array for non-existent category', () => {
      const emptyPresets = getPresetsByCategory([], 'panel-size');
      expect(emptyPresets).toEqual([]);
    });
  });

  describe('findPresetById', () => {
    it('should find preset by ID', () => {
      const firstPreset = defaultPresets[0];
      const found = findPresetById(defaultPresets, firstPreset.id);
      expect(found).toEqual(firstPreset);
    });

    it('should return undefined for non-existent ID', () => {
      const found = findPresetById(defaultPresets, 'non-existent-id');
      expect(found).toBeUndefined();
    });

    it('should find preset with specific properties', () => {
      const found = findPresetById(defaultPresets, 'panel-500x500');
      expect(found).toBeDefined();
      expect(found?.panelWidth).toBe(500);
      expect(found?.panelHeight).toBe(500);
    });
  });
});
