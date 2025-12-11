/**
 * Unit tests for Preset Storage
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  loadCustomPresets,
  saveCustomPresets,
  getAllPresets,
  addCustomPreset,
  updateCustomPreset,
  deleteCustomPreset,
  exportPresets,
  importPresets,
  clearCustomPresets,
} from './presetStorage';
import type { LEDPreset } from '@/types/preset';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Set up global localStorage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.localStorage = localStorageMock as any;

describe('Preset Storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('loadCustomPresets', () => {
    it('should return empty array when no presets are stored', () => {
      const presets = loadCustomPresets();
      expect(presets).toEqual([]);
    });

    it('should load presets from localStorage', () => {
      const mockPresets: LEDPreset[] = [
        {
          id: 'custom-1',
          name: 'Test Preset',
          category: 'use-case',
          panelWidth: 400,
          panelHeight: 400,
          ledPitch: 3,
          description: 'Test description',
          isCustom: true,
        },
      ];
      localStorage.setItem('led-calculator-presets', JSON.stringify(mockPresets));

      const presets = loadCustomPresets();
      expect(presets).toEqual(mockPresets);
    });

    it('should return empty array for invalid JSON', () => {
      localStorage.setItem('led-calculator-presets', 'invalid json');
      const presets = loadCustomPresets();
      expect(presets).toEqual([]);
    });
  });

  describe('saveCustomPresets', () => {
    it('should save presets to localStorage', () => {
      const mockPresets: LEDPreset[] = [
        {
          id: 'custom-1',
          name: 'Test Preset',
          category: 'use-case',
          panelWidth: 400,
          panelHeight: 400,
          ledPitch: 3,
          description: 'Test description',
          isCustom: true,
        },
      ];

      const result = saveCustomPresets(mockPresets);
      expect(result).toBe(true);

      const stored = localStorage.getItem('led-calculator-presets');
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(mockPresets);
    });
  });

  describe('getAllPresets', () => {
    it('should return default presets when no custom presets exist', () => {
      const allPresets = getAllPresets();
      expect(allPresets.length).toBeGreaterThan(0);
      // Should contain default presets
      expect(allPresets.some(p => p.id === 'panel-500x500')).toBe(true);
    });

    it('should merge default and custom presets', () => {
      const customPreset: LEDPreset = {
        id: 'custom-1',
        name: 'Custom Test',
        category: 'use-case',
        panelWidth: 400,
        panelHeight: 400,
        ledPitch: 3,
        description: 'Custom description',
        isCustom: true,
      };
      saveCustomPresets([customPreset]);

      const allPresets = getAllPresets();
      expect(allPresets.some(p => p.id === 'panel-500x500')).toBe(true);
      expect(allPresets.some(p => p.id === 'custom-1')).toBe(true);
    });
  });

  describe('addCustomPreset', () => {
    it('should add a new custom preset', () => {
      const newPreset = addCustomPreset({
        name: 'New Preset',
        category: 'use-case',
        panelWidth: 600,
        panelHeight: 600,
        ledPitch: 4,
        description: 'New preset description',
      });

      expect(newPreset.id).toBeDefined();
      expect(newPreset.id).toMatch(/^custom-/);
      expect(newPreset.isCustom).toBe(true);
      expect(newPreset.name).toBe('New Preset');

      const stored = loadCustomPresets();
      expect(stored.length).toBe(1);
      expect(stored[0]).toEqual(newPreset);
    });

    it('should preserve existing presets when adding new one', () => {
      const first = addCustomPreset({
        name: 'First',
        category: 'use-case',
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 3,
        description: 'First preset',
      });

      const second = addCustomPreset({
        name: 'Second',
        category: 'pitch',
        panelWidth: 600,
        panelHeight: 600,
        ledPitch: 4,
        description: 'Second preset',
      });

      const stored = loadCustomPresets();
      expect(stored.length).toBe(2);
      expect(stored[0].id).toBe(first.id);
      expect(stored[1].id).toBe(second.id);
    });
  });

  describe('updateCustomPreset', () => {
    it('should update an existing custom preset', () => {
      const preset = addCustomPreset({
        name: 'Original',
        category: 'use-case',
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 3,
        description: 'Original description',
      });

      const success = updateCustomPreset(preset.id, {
        name: 'Updated',
        description: 'Updated description',
      });

      expect(success).toBe(true);

      const stored = loadCustomPresets();
      expect(stored[0].name).toBe('Updated');
      expect(stored[0].description).toBe('Updated description');
      expect(stored[0].panelWidth).toBe(500); // Unchanged
    });

    it('should return false for non-existent preset', () => {
      const success = updateCustomPreset('non-existent', { name: 'Test' });
      expect(success).toBe(false);
    });
  });

  describe('deleteCustomPreset', () => {
    it('should delete a custom preset', () => {
      const preset = addCustomPreset({
        name: 'To Delete',
        category: 'use-case',
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 3,
        description: 'Will be deleted',
      });

      const success = deleteCustomPreset(preset.id);
      expect(success).toBe(true);

      const stored = loadCustomPresets();
      expect(stored.length).toBe(0);
    });

    it('should return false for non-existent preset', () => {
      const success = deleteCustomPreset('non-existent');
      expect(success).toBe(false);
    });

    it('should only delete the specified preset', () => {
      const first = addCustomPreset({
        name: 'First',
        category: 'use-case',
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 3,
        description: 'First',
      });

      const second = addCustomPreset({
        name: 'Second',
        category: 'use-case',
        panelWidth: 600,
        panelHeight: 600,
        ledPitch: 4,
        description: 'Second',
      });

      deleteCustomPreset(first.id);

      const stored = loadCustomPresets();
      expect(stored.length).toBe(1);
      expect(stored[0].id).toBe(second.id);
    });
  });

  describe('exportPresets', () => {
    it('should export presets with version and date', () => {
      const presets: LEDPreset[] = [
        {
          id: 'custom-1',
          name: 'Test',
          category: 'use-case',
          panelWidth: 500,
          panelHeight: 500,
          ledPitch: 3,
          description: 'Test',
          isCustom: true,
        },
      ];

      const exported = exportPresets(presets);

      expect(exported.version).toBe('1.0');
      expect(exported.exportDate).toBeDefined();
      expect(exported.presets).toEqual(presets);
    });
  });

  describe('importPresets', () => {
    it('should import presets from export data', () => {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        presets: [
          {
            id: 'old-id',
            name: 'Imported',
            category: 'use-case' as const,
            panelWidth: 500,
            panelHeight: 500,
            ledPitch: 3,
            description: 'Imported preset',
          },
        ],
      };

      const imported = importPresets(exportData);

      expect(imported.length).toBe(1);
      expect(imported[0].name).toBe('Imported');
      expect(imported[0].isCustom).toBe(true);
      // Should get new ID
      expect(imported[0].id).not.toBe('old-id');
      expect(imported[0].id).toMatch(/^custom-/);

      const stored = loadCustomPresets();
      expect(stored.length).toBe(1);
    });

    it('should throw error for invalid data', () => {
      const invalidData = { invalid: 'data' };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => importPresets(invalidData as any)).toThrow('Invalid preset data format');
    });

    it('should merge with existing presets', () => {
      addCustomPreset({
        name: 'Existing',
        category: 'use-case',
        panelWidth: 400,
        panelHeight: 400,
        ledPitch: 2,
        description: 'Existing',
      });

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        presets: [
          {
            id: 'import-1',
            name: 'Imported',
            category: 'pitch' as const,
            panelWidth: 500,
            panelHeight: 500,
            ledPitch: 3,
            description: 'Imported',
          },
        ],
      };

      importPresets(exportData);

      const stored = loadCustomPresets();
      expect(stored.length).toBe(2);
    });
  });

  describe('clearCustomPresets', () => {
    it('should clear all custom presets', () => {
      addCustomPreset({
        name: 'Test',
        category: 'use-case',
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 3,
        description: 'Test',
      });

      const success = clearCustomPresets();
      expect(success).toBe(true);

      const stored = loadCustomPresets();
      expect(stored.length).toBe(0);
    });
  });
});
