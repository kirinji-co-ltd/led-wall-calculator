/**
 * Local Storage Management for LED Panel Presets
 */

import type { LEDPreset, PresetExport } from '@/types/preset';
import { defaultPresets } from './presets';

const STORAGE_KEY = 'led-calculator-presets';
const STORAGE_VERSION = '1.0';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load custom presets from localStorage
 */
export function loadCustomPresets(): LEDPreset[] {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const data = JSON.parse(stored) as LEDPreset[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load custom presets:', error);
    return [];
  }
}

/**
 * Save custom presets to localStorage
 */
export function saveCustomPresets(presets: LEDPreset[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    return true;
  } catch (error) {
    console.error('Failed to save custom presets:', error);
    return false;
  }
}

/**
 * Get all presets (default + custom)
 */
export function getAllPresets(): LEDPreset[] {
  const customPresets = loadCustomPresets();
  return [...defaultPresets, ...customPresets];
}

/**
 * Add a new custom preset
 */
export function addCustomPreset(preset: Omit<LEDPreset, 'id' | 'isCustom'>): LEDPreset {
  const customPresets = loadCustomPresets();
  
  const newPreset: LEDPreset = {
    ...preset,
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    isCustom: true,
  };

  customPresets.push(newPreset);
  saveCustomPresets(customPresets);
  
  return newPreset;
}

/**
 * Update an existing custom preset
 */
export function updateCustomPreset(id: string, updates: Partial<LEDPreset>): boolean {
  const customPresets = loadCustomPresets();
  const index = customPresets.findIndex(p => p.id === id && p.isCustom);
  
  if (index === -1) {
    return false;
  }

  customPresets[index] = {
    ...customPresets[index],
    ...updates,
    id, // Preserve ID
    isCustom: true, // Preserve custom flag
  };

  return saveCustomPresets(customPresets);
}

/**
 * Delete a custom preset
 */
export function deleteCustomPreset(id: string): boolean {
  const customPresets = loadCustomPresets();
  const filtered = customPresets.filter(p => p.id !== id);
  
  if (filtered.length === customPresets.length) {
    return false; // Preset not found
  }

  return saveCustomPresets(filtered);
}

/**
 * Export presets to JSON
 */
export function exportPresets(presets: LEDPreset[]): PresetExport {
  return {
    version: STORAGE_VERSION,
    exportDate: new Date().toISOString(),
    presets,
  };
}

/**
 * Import presets from JSON
 */
export function importPresets(data: PresetExport): LEDPreset[] {
  if (!data.presets || !Array.isArray(data.presets)) {
    throw new Error('Invalid preset data format');
  }

  const customPresets = loadCustomPresets();
  
  // Add imported presets as custom presets (with new IDs to avoid conflicts)
  const importedPresets = data.presets.map(preset => ({
    ...preset,
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    isCustom: true,
  }));

  const merged = [...customPresets, ...importedPresets];
  saveCustomPresets(merged);
  
  return importedPresets;
}

/**
 * Clear all custom presets
 */
export function clearCustomPresets(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear custom presets:', error);
    return false;
  }
}
