/**
 * Default LED Panel Presets
 */

import type { LEDPreset } from '@/types/preset';

/**
 * Default presets provided by the system
 */
export const defaultPresets: LEDPreset[] = [
  // Panel Size Presets
  {
    id: 'panel-500x500',
    name: '500mm × 500mm',
    category: 'panel-size',
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 3.91,
    description: '標準的な500mm正方形パネル',
  },
  {
    id: 'panel-320x320',
    name: '320mm × 320mm',
    category: 'panel-size',
    panelWidth: 320,
    panelHeight: 320,
    ledPitch: 2.5,
    description: 'コンパクトな320mm正方形パネル',
  },
  {
    id: 'panel-250x250',
    name: '250mm × 250mm',
    category: 'panel-size',
    panelWidth: 250,
    panelHeight: 250,
    ledPitch: 2.5,
    description: '小型の250mm正方形パネル',
  },

  // Pitch Presets
  {
    id: 'pitch-p2.5',
    name: 'P2.5（屋内高品質）',
    category: 'pitch',
    panelWidth: 320,
    panelHeight: 320,
    ledPitch: 2.5,
    description: '屋内用高解像度ディスプレイ、視聴距離2.5m以上',
  },
  {
    id: 'pitch-p3.91',
    name: 'P3.91（屋内標準）',
    category: 'pitch',
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 3.91,
    description: '屋内用標準ディスプレイ、視聴距離4m以上',
  },
  {
    id: 'pitch-p5',
    name: 'P5（屋内・屋外）',
    category: 'pitch',
    panelWidth: 640,
    panelHeight: 640,
    ledPitch: 5,
    description: '屋内外兼用ディスプレイ、視聴距離5m以上',
  },
  {
    id: 'pitch-p10',
    name: 'P10（屋外大画面）',
    category: 'pitch',
    panelWidth: 960,
    panelHeight: 960,
    ledPitch: 10,
    description: '屋外大画面ディスプレイ、視聴距離10m以上',
  },

  // Use Case Presets
  {
    id: 'usecase-conference',
    name: '会議室用',
    category: 'use-case',
    panelWidth: 320,
    panelHeight: 320,
    ledPitch: 2.5,
    description: '会議室向け小型・高解像度ディスプレイ（視聴距離3-5m）',
  },
  {
    id: 'usecase-event',
    name: 'イベント用',
    category: 'use-case',
    panelWidth: 500,
    panelHeight: 500,
    ledPitch: 3.91,
    description: 'イベント向け中型・標準ディスプレイ（視聴距離5-10m）',
  },
  {
    id: 'usecase-outdoor',
    name: '屋外広告用',
    category: 'use-case',
    panelWidth: 960,
    panelHeight: 960,
    ledPitch: 10,
    description: '屋外広告向け大型・低解像度ディスプレイ（視聴距離10m以上）',
  },
];

/**
 * Get preset category label in Japanese
 */
export function getCategoryLabel(category: LEDPreset['category']): string {
  const labels: Record<LEDPreset['category'], string> = {
    'panel-size': 'パネルサイズ',
    'pitch': 'ピッチ',
    'use-case': '用途',
  };
  return labels[category];
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(
  presets: LEDPreset[],
  category: LEDPreset['category']
): LEDPreset[] {
  return presets.filter(preset => preset.category === category);
}

/**
 * Find preset by ID
 */
export function findPresetById(presets: LEDPreset[], id: string): LEDPreset | undefined {
  return presets.find(preset => preset.id === id);
}
