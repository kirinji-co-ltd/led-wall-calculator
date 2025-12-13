/**
 * LED Panel Model Database
 * Contains information about available LED panel models
 */

import type { LEDPanelModel } from '@/types/ledPanel';

/**
 * Q+ Series LED Panels
 * High-quality indoor LED panels
 */
export const panelModels: LEDPanelModel[] = [
  {
    id: 'q-plus-p1.5',
    modelNumber: 'Q+1.5',
    displayName: 'Q+1.5',
    series: 'Q+',
    panelWidth: 600,
    panelHeight: 337.5,
    pixelPitch: 1.5,
    brightness: 800,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 6.5,
    powerConsumption: 180,
    description: '超高解像度屋内用LEDパネル、至近距離での視聴に最適',
    useCase: '会議室、ショールーム、高級ブティック',
  },
  {
    id: 'q-plus-p1.9',
    modelNumber: 'Q+1.9',
    displayName: 'Q+1.9',
    series: 'Q+',
    panelWidth: 600,
    panelHeight: 337.5,
    pixelPitch: 1.9,
    brightness: 800,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 6.5,
    powerConsumption: 180,
    description: '高解像度屋内用LEDパネル、近距離視聴向け',
    useCase: '会議室、プレゼンテーションルーム、展示会',
  },
  {
    id: 'q-plus-p2.5',
    modelNumber: 'Q+2.5',
    displayName: 'Q+2.5',
    series: 'Q+',
    panelWidth: 640,
    panelHeight: 480,
    pixelPitch: 2.5,
    brightness: 1000,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 8.0,
    powerConsumption: 220,
    description: '高解像度屋内用LEDパネル、標準的な視聴距離に対応',
    useCase: 'イベント会場、ショッピングモール、企業ロビー',
  },
  {
    id: 'q-plus-p3.0',
    modelNumber: 'Q+3.0',
    displayName: 'Q+3.0',
    series: 'Q+',
    panelWidth: 576,
    panelHeight: 576,
    pixelPitch: 3.0,
    brightness: 1200,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 9.0,
    powerConsumption: 250,
    description: '屋内用LEDパネル、中距離視聴に最適なバランス型',
    useCase: 'イベント会場、ホール、大型会議室',
  },
  {
    id: 'q-plus-p3.9',
    modelNumber: 'Q+3.9',
    displayName: 'Q+3.9',
    series: 'Q+',
    panelWidth: 500,
    panelHeight: 500,
    pixelPitch: 3.91,
    brightness: 1200,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 7.5,
    powerConsumption: 230,
    description: '汎用性の高い屋内用LEDパネル、多様な用途に対応',
    useCase: 'レンタル用途、イベント、コンサート、展示会',
  },
  {
    id: 'q-plus-p4.8',
    modelNumber: 'Q+4.8',
    displayName: 'Q+4.8',
    series: 'Q+',
    panelWidth: 576,
    panelHeight: 576,
    pixelPitch: 4.8,
    brightness: 1500,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 9.5,
    powerConsumption: 280,
    description: '屋内外兼用LEDパネル、遠距離視聴に対応',
    useCase: 'スタジアム、大型イベント、屋外広告',
  },
];

/**
 * Get panel model by ID
 */
export function getPanelModelById(id: string): LEDPanelModel | undefined {
  return panelModels.find(model => model.id === id);
}

/**
 * Get panel models by series
 */
export function getPanelModelsBySeries(series: string): LEDPanelModel[] {
  return panelModels.filter(model => model.series === series);
}

/**
 * Get all available series
 */
export function getAvailableSeries(): string[] {
  const seriesSet = new Set(panelModels.map(model => model.series));
  return Array.from(seriesSet);
}
