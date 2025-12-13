/**
 * LED Wall Calculation Engine
 * 
 * Pure functions for calculating LED wall specifications based on input parameters.
 */

import type {
  LEDWallInput,
  LEDWallCalculationResult,
  Resolution,
  PhysicalSize,
  ViewingDistance,
  CostEstimate,
  PanelModelInfo,
} from '@/types/led-calculator';
import { CalculationError, CalculationErrorType } from '@/types/led-calculator';
import { getPanelModelById } from './panelModels';

/**
 * Validates input parameters for LED wall calculations
 * 
 * @param input - Input parameters to validate
 * @throws {CalculationError} If any parameter is invalid
 */
export function validateInput(input: LEDWallInput): void {
  const { panelWidth, panelHeight, screenWidth, screenHeight, ledPitch, pricePerPanel } = input;

  if (panelWidth <= 0 || panelHeight <= 0) {
    throw new CalculationError(
      CalculationErrorType.INVALID_INPUT,
      'パネルサイズは0より大きい値である必要があります'
    );
  }

  if (screenWidth <= 0 || screenHeight <= 0) {
    throw new CalculationError(
      CalculationErrorType.INVALID_INPUT,
      '画面サイズ（枚数）は0より大きい値である必要があります'
    );
  }

  if (!Number.isInteger(screenWidth) || !Number.isInteger(screenHeight)) {
    throw new CalculationError(
      CalculationErrorType.INVALID_INPUT,
      '画面サイズ（枚数）は整数である必要があります'
    );
  }

  if (ledPitch <= 0) {
    throw new CalculationError(
      CalculationErrorType.ZERO_DIVISION,
      'LEDピッチは0より大きい値である必要があります'
    );
  }

  if (pricePerPanel !== undefined && pricePerPanel < 0) {
    throw new CalculationError(
      CalculationErrorType.INVALID_INPUT,
      'パネル価格は0以上である必要があります'
    );
  }
}

/**
 * Calculates total number of panels
 * 
 * Formula: totalPanels = screenWidth × screenHeight
 * 
 * @param screenWidth - Number of panels horizontally
 * @param screenHeight - Number of panels vertically
 * @returns Total number of panels
 */
export function calculatePanelCount(screenWidth: number, screenHeight: number): number {
  return screenWidth * screenHeight;
}

/**
 * Calculates resolution based on panel dimensions and LED pitch
 * 
 * Formula:
 * - width = (panelWidth / ledPitch) × screenWidth
 * - height = (panelHeight / ledPitch) × screenHeight
 * 
 * @param input - LED wall input parameters
 * @returns Resolution information (width, height, total pixels)
 */
export function calculateResolution(input: LEDWallInput): Resolution {
  const { panelWidth, panelHeight, screenWidth, screenHeight, ledPitch } = input;

  // Calculate pixels per panel
  const pixelsPerPanelWidth = Math.floor(panelWidth / ledPitch);
  const pixelsPerPanelHeight = Math.floor(panelHeight / ledPitch);

  // Calculate total resolution
  const width = pixelsPerPanelWidth * screenWidth;
  const height = pixelsPerPanelHeight * screenHeight;
  const totalPixels = width * height;

  return {
    width,
    height,
    totalPixels,
  };
}

/**
 * Calculates physical size of the LED wall
 * 
 * Formula:
 * - width = panelWidth × screenWidth (mm)
 * - height = panelHeight × screenHeight (mm)
 * - area = (width × height) / 1,000,000 (m²)
 * 
 * @param input - LED wall input parameters
 * @returns Physical dimensions in mm and area in m²
 */
export function calculatePhysicalSize(input: LEDWallInput): PhysicalSize {
  const { panelWidth, panelHeight, screenWidth, screenHeight } = input;

  const width = panelWidth * screenWidth;
  const height = panelHeight * screenHeight;
  const area = (width * height) / 1_000_000; // Convert mm² to m²

  return {
    width,
    height,
    area,
  };
}

/**
 * Calculates pixel density (pixels per square meter)
 * 
 * Formula: pixelDensity = totalPixels / area
 * 
 * @param resolution - Resolution information
 * @param physicalSize - Physical size information
 * @returns Pixel density in pixels/m²
 * @throws {CalculationError} If area is zero
 */
export function calculatePixelDensity(resolution: Resolution, physicalSize: PhysicalSize): number {
  if (physicalSize.area === 0) {
    throw new CalculationError(
      CalculationErrorType.ZERO_DIVISION,
      '面積が0のためピクセル密度を計算できません'
    );
  }

  return resolution.totalPixels / physicalSize.area;
}

/**
 * Calculates recommended viewing distances
 * 
 * Formulas based on industry standards:
 * - minimum = ledPitch × 1000 (mm to m) - Minimum distance to see smooth image
 * - optimal = max(width, height) × 3.5 - Optimal viewing experience
 * - maximum = max(width, height) × 10 - Maximum effective viewing distance
 * 
 * @param input - LED wall input parameters
 * @param physicalSize - Physical size information
 * @returns Viewing distance recommendations in meters
 */
export function calculateViewingDistance(
  input: LEDWallInput,
  physicalSize: PhysicalSize
): ViewingDistance {
  const { ledPitch } = input;
  const maxDimension = Math.max(physicalSize.width, physicalSize.height);

  // Convert mm to m
  const minimum = (ledPitch * 1000) / 1000; // LED pitch × 1000, then convert to meters
  const optimal = (maxDimension * 3.5) / 1000; // Convert mm to m
  const maximum = (maxDimension * 10) / 1000; // Convert mm to m

  return {
    minimum: Math.round(minimum * 10) / 10, // Round to 1 decimal place
    optimal: Math.round(optimal * 10) / 10,
    maximum: Math.round(maximum * 10) / 10,
  };
}

/**
 * Calculates cost estimate if price per panel is provided
 * 
 * @param panelCount - Total number of panels
 * @param pricePerPanel - Price per panel in yen
 * @param area - Total area in m²
 * @returns Cost estimation
 * @throws {CalculationError} If area is zero
 */
export function calculateCostEstimate(
  panelCount: number,
  pricePerPanel: number,
  area: number
): CostEstimate {
  if (area === 0) {
    throw new CalculationError(
      CalculationErrorType.ZERO_DIVISION,
      '面積が0のため平方メートルあたりの費用を計算できません'
    );
  }

  const totalCost = panelCount * pricePerPanel;
  const costPerSquareMeter = totalCost / area;

  return {
    panelCount,
    totalCost: Math.round(totalCost),
    costPerSquareMeter: Math.round(costPerSquareMeter),
  };
}

/**
 * Main calculation function that computes all LED wall specifications
 * 
 * @param input - LED wall input parameters
 * @returns Complete calculation results
 * @throws {CalculationError} If input is invalid or calculation fails
 * 
 * @example
 * ```typescript
 * const result = calculateLEDWall({
 *   panelWidth: 500,
 *   panelHeight: 500,
 *   screenWidth: 4,
 *   screenHeight: 3,
 *   ledPitch: 2.5,
 *   pricePerPanel: 100000,
 * });
 * 
 * console.log(result.resolution); // { width: 800, height: 600, totalPixels: 480000 }
 * console.log(result.physicalSize); // { width: 2000, height: 1500, area: 3 }
 * ```
 */
export function calculateLEDWall(input: LEDWallInput): LEDWallCalculationResult {
  // Validate input
  validateInput(input);

  // Calculate panel count
  const panelCount = calculatePanelCount(input.screenWidth, input.screenHeight);

  // Calculate resolution
  const resolution = calculateResolution(input);

  // Calculate physical size
  const physicalSize = calculatePhysicalSize(input);

  // Calculate pixel density
  const pixelDensity = calculatePixelDensity(resolution, physicalSize);

  // Calculate viewing distance
  const viewingDistance = calculateViewingDistance(input, physicalSize);

  // Calculate cost estimate if price is provided
  const costEstimate = input.pricePerPanel !== undefined
    ? calculateCostEstimate(panelCount, input.pricePerPanel, physicalSize.area)
    : undefined;

  // Get panel model information if panel ID is provided
  let panelModel: PanelModelInfo | undefined;
  if (input.selectedPanelId) {
    const panel = getPanelModelById(input.selectedPanelId);
    if (panel) {
      panelModel = {
        id: panel.id,
        modelNumber: panel.modelNumber,
        displayName: panel.displayName,
        series: panel.series,
        brightness: panel.brightness,
        refreshRate: panel.refreshRate,
        viewingAngle: panel.viewingAngle,
      };
    }
  }

  return {
    input,
    panelCount,
    resolution,
    physicalSize,
    pixelDensity: Math.round(pixelDensity),
    viewingDistance,
    costEstimate,
    panelModel,
  };
}

/**
 * Unit conversion utilities
 */
export const unitConversion = {
  /**
   * Convert millimeters to meters
   */
  mmToM: (mm: number): number => mm / 1000,

  /**
   * Convert meters to millimeters
   */
  mToMm: (m: number): number => m * 1000,

  /**
   * Convert square millimeters to square meters
   */
  mm2ToM2: (mm2: number): number => mm2 / 1_000_000,

  /**
   * Convert square meters to square millimeters
   */
  m2ToMm2: (m2: number): number => m2 * 1_000_000,
};
