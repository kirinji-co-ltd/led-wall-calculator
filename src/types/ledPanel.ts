/**
 * LED Panel Form Data Types
 */

export interface LEDPanelFormData {
  /** LEDパネル幅（mm） */
  panelWidth: number;
  /** LEDパネル高さ（mm） */
  panelHeight: number;
  /** 画面幅（枚数） */
  screenWidth: number;
  /** 画面高さ（枚数） */
  screenHeight: number;
  /** LEDピッチ（mm） */
  ledPitch: number;
  /** 視聴距離（m） */
  viewingDistance: number;
  /** 予算範囲（円） */
  budget: number;
}

export interface ValidationError {
  field: keyof LEDPanelFormData;
  message: string;
}

export type FieldValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * LED Panel Model Information
 */
export interface LEDPanelModel {
  /** Unique identifier */
  id: string;
  /** Model number/name */
  modelNumber: string;
  /** Display name */
  displayName: string;
  /** Product series (e.g., "Q+") */
  series: string;
  /** Panel image URL or path */
  imageUrl?: string;
  /** Panel width in mm */
  panelWidth: number;
  /** Panel height in mm */
  panelHeight: number;
  /** LED pixel pitch in mm */
  pixelPitch: number;
  /** Brightness in nits/cd/m² */
  brightness: number;
  /** Refresh rate in Hz */
  refreshRate?: number;
  /** Viewing angle in degrees */
  viewingAngle?: number;
  /** Weight in kg */
  weight?: number;
  /** Power consumption in watts */
  powerConsumption?: number;
  /** Panel description */
  description: string;
  /** Use case recommendations */
  useCase?: string;
  /** Price per panel (optional) */
  pricePerPanel?: number;
}

/**
 * Input type for creating a new LED panel model
 * All required fields must be provided
 */
export type LEDPanelModelInput = Omit<LEDPanelModel, 'id'> & {
  /** ID is optional on input - will be auto-generated if not provided */
  id?: string;
};

/**
 * Validation result for LED panel data
 */
export interface PanelValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Panel data validation constraints
 */
export const PANEL_CONSTRAINTS = {
  panelWidth: { min: 100, max: 5000 },
  panelHeight: { min: 100, max: 5000 },
  pixelPitch: { min: 0.5, max: 50 },
  brightness: { min: 100, max: 10000 },
  refreshRate: { min: 60, max: 7680 },
  viewingAngle: { min: 10, max: 180 },
  weight: { min: 0.1, max: 100 },
  powerConsumption: { min: 10, max: 2000 },
  pricePerPanel: { min: 0, max: 10000000 },
} as const;
