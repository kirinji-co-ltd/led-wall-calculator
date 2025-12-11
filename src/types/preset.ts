/**
 * LED Panel Preset Types
 */

/**
 * Preset category types
 */
export type PresetCategory = 'panel-size' | 'pitch' | 'use-case';

/**
 * LED Panel Preset
 */
export interface LEDPreset {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category classification */
  category: PresetCategory;
  /** Panel width in mm */
  panelWidth: number;
  /** Panel height in mm */
  panelHeight: number;
  /** LED pitch in mm */
  ledPitch: number;
  /** Description of the preset */
  description: string;
  /** Whether this is a custom user-created preset */
  isCustom?: boolean;
}

/**
 * Preset export/import format
 */
export interface PresetExport {
  version: string;
  exportDate: string;
  presets: LEDPreset[];
}
