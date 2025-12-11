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
