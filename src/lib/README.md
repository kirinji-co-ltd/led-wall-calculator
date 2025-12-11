# LED Wall Calculation Engine

純粋関数として実装されたLEDウォール計算ライブラリです。

## 機能

- **パネル数計算**: 画面サイズとパネルサイズから必要なパネル数を算出
- **解像度計算**: LEDピッチとパネル数から総解像度を算出
- **視聴距離最適化**: 解像度と画面サイズから推奨視聴距離を計算
- **ピクセル密度**: 1平方メートルあたりのピクセル数を計算
- **総画面サイズ**: 物理的な画面寸法（横×縦mm）を算出
- **コスト見積もり**: パネル数から概算費用を計算

## 使用方法

### 基本的な使い方

```typescript
import { calculateLEDWall } from '@/lib/calculations';

// 入力パラメータ
const input = {
  panelWidth: 500,      // パネル幅 (mm)
  panelHeight: 500,     // パネル高さ (mm)
  screenWidth: 4,       // 画面幅（パネル枚数）
  screenHeight: 3,      // 画面高さ（パネル枚数）
  ledPitch: 2.5,        // LEDピッチ (mm)
  pricePerPanel: 100000 // パネルあたりの価格 (円) - オプション
};

// 計算実行
const result = calculateLEDWall(input);

console.log(result);
// {
//   panelCount: 12,
//   resolution: { width: 800, height: 600, totalPixels: 480000 },
//   physicalSize: { width: 2000, height: 1500, area: 3 },
//   pixelDensity: 160000,
//   viewingDistance: { minimum: 2.5, optimal: 7, maximum: 20 },
//   costEstimate: { panelCount: 12, totalCost: 1200000, costPerSquareMeter: 400000 }
// }
```

### 個別の計算関数

必要に応じて、個別の計算関数を使用することもできます。

```typescript
import {
  calculatePanelCount,
  calculateResolution,
  calculatePhysicalSize,
  calculatePixelDensity,
  calculateViewingDistance,
  calculateCostEstimate,
  unitConversion
} from '@/lib/calculations';

// パネル数のみを計算
const panelCount = calculatePanelCount(4, 3); // 12

// 解像度のみを計算
const resolution = calculateResolution({
  panelWidth: 500,
  panelHeight: 500,
  screenWidth: 4,
  screenHeight: 3,
  ledPitch: 2.5
});

// 単位変換
const meters = unitConversion.mmToM(2000); // 2m
const squareMeters = unitConversion.mm2ToM2(3000000); // 3m²
```

### エラーハンドリング

不正な入力値はエラーを投げます。

```typescript
import { calculateLEDWall } from '@/lib/calculations';
import { CalculationError, CalculationErrorType } from '@/types/led-calculator';

try {
  const result = calculateLEDWall({
    panelWidth: 0,  // ❌ 不正な値
    panelHeight: 500,
    screenWidth: 4,
    screenHeight: 3,
    ledPitch: 2.5
  });
} catch (error) {
  if (error instanceof CalculationError) {
    console.error('計算エラー:', error.message);
    console.error('エラータイプ:', error.type);
  }
}
```

## 型定義

詳細な型定義は `@/types/led-calculator` を参照してください。

### 主要な型

- `LEDWallInput`: 入力パラメータ
- `LEDWallCalculationResult`: 計算結果
- `Resolution`: 解像度情報
- `PhysicalSize`: 物理サイズ情報
- `ViewingDistance`: 推奨視聴距離
- `CostEstimate`: コスト見積もり
- `CalculationError`: 計算エラー

## 計算式

### パネル数
```
totalPanels = screenWidth × screenHeight
```

### 解像度
```
pixelsPerPanelWidth = floor(panelWidth / ledPitch)
pixelsPerPanelHeight = floor(panelHeight / ledPitch)
resolutionWidth = pixelsPerPanelWidth × screenWidth
resolutionHeight = pixelsPerPanelHeight × screenHeight
```

### 物理サイズ
```
physicalWidth = panelWidth × screenWidth (mm)
physicalHeight = panelHeight × screenHeight (mm)
area = (physicalWidth × physicalHeight) / 1,000,000 (m²)
```

### ピクセル密度
```
pixelDensity = totalPixels / area (pixels/m²)
```

### 推奨視聴距離
```
minimum = ledPitch × 1000 / 1000 (m)
optimal = max(width, height) × 3.5 / 1000 (m)
maximum = max(width, height) × 10 / 1000 (m)
```

### コスト
```
totalCost = panelCount × pricePerPanel (円)
costPerSquareMeter = totalCost / area (円/m²)
```

## テスト

```bash
# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# カバレッジ付きテスト
npm test -- --coverage
```

現在のテストカバレッジ: **100%**

## ライセンス

このプロジェクトのライセンスに従います。
