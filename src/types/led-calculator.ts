/**
 * LED Wall Calculator Type Definitions
 */

/**
 * Input parameters for LED wall calculations
 */
export interface LEDWallInput {
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
  /** パネルあたりの価格（円） - オプション */
  pricePerPanel?: number;
  /** 選択されたパネルモデルID - オプション */
  selectedPanelId?: string;
}

/**
 * Resolution information (width x height in pixels)
 */
export interface Resolution {
  /** 横解像度（ピクセル） */
  width: number;
  /** 縦解像度（ピクセル） */
  height: number;
  /** 総ピクセル数 */
  totalPixels: number;
}

/**
 * Physical dimensions (width x height in mm)
 */
export interface PhysicalSize {
  /** 横幅（mm） */
  width: number;
  /** 高さ（mm） */
  height: number;
  /** 面積（平方メートル） */
  area: number;
}

/**
 * Viewing distance recommendations
 */
export interface ViewingDistance {
  /** 最小推奨視聴距離（m） */
  minimum: number;
  /** 最適視聴距離（m） */
  optimal: number;
  /** 最大推奨視聴距離（m） */
  maximum: number;
}

/**
 * Cost estimation
 */
export interface CostEstimate {
  /** パネル数 */
  panelCount: number;
  /** 総費用（円） */
  totalCost: number;
  /** 平方メートルあたりの費用（円/m²） */
  costPerSquareMeter: number;
}

/**
 * Panel model information in calculation result
 */
export interface PanelModelInfo {
  /** Panel model ID */
  id: string;
  /** Model number/name */
  modelNumber: string;
  /** Display name */
  displayName: string;
  /** Product series */
  series: string;
  /** Brightness in nits */
  brightness: number;
  /** Refresh rate in Hz */
  refreshRate?: number;
  /** Viewing angle in degrees */
  viewingAngle?: number;
}

/**
 * Complete calculation results for LED wall
 */
export interface LEDWallCalculationResult {
  /** 入力パラメータ */
  input: LEDWallInput;
  /** パネル数（横×縦） */
  panelCount: number;
  /** 総解像度 */
  resolution: Resolution;
  /** 物理的な画面サイズ */
  physicalSize: PhysicalSize;
  /** ピクセル密度（ピクセル/m²） */
  pixelDensity: number;
  /** 推奨視聴距離 */
  viewingDistance: ViewingDistance;
  /** コスト見積もり（pricePerPanelが指定されている場合のみ） */
  costEstimate?: CostEstimate;
  /** 選択されたパネルモデル情報（selectedPanelIdが指定されている場合のみ） */
  panelModel?: PanelModelInfo;
}

/**
 * Calculation error types
 */
export enum CalculationErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  ZERO_DIVISION = 'ZERO_DIVISION',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
}

/**
 * Calculation error
 */
export class CalculationError extends Error {
  constructor(
    public type: CalculationErrorType,
    message: string,
  ) {
    super(message);
    this.name = 'CalculationError';
  }
}
