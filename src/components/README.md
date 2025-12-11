# Components

このディレクトリには、LED Wall Calculatorアプリケーションの再利用可能なコンポーネントが含まれています。

## ディレクトリ構造

```
components/
├── form/              # フォーム関連コンポーネント
│   ├── LEDPanelForm.tsx       # LEDパネル仕様入力フォーム
│   ├── NumberInput.tsx        # 数値入力フィールド
│   ├── ErrorMessage.tsx       # エラーメッセージ表示
│   └── index.ts              # フォームコンポーネントのエクスポート
├── results/           # 計算結果表示コンポーネント
│   ├── CalculationResult.tsx  # 計算結果表示コンポーネント
│   └── index.ts              # 結果コンポーネントのエクスポート
└── layout/            # レイアウトコンポーネント
    ├── Header.tsx            # アプリケーションヘッダー
    ├── Footer.tsx            # アプリケーションフッター
    ├── ErrorBoundary.tsx     # エラーバウンダリー
    └── index.ts              # レイアウトコンポーネントのエクスポート
```

## コンポーネント概要

### Form Components (`form/`)

#### LEDPanelForm
LEDパネルの仕様を入力するためのフォームコンポーネント。

**主な機能:**
- 7つの入力フィールド（パネルサイズ、画面サイズ、LEDピッチ、視聴距離、予算）
- リアルタイムバリデーション
- フィールドレベルのエラー表示
- フォーム送信ハンドラー
- リアルタイム変更ハンドラー

**Props:**
- `initialValues?: Partial<LEDPanelFormData>` - 初期値
- `onSubmit?: (data: LEDPanelFormData) => void` - 送信ハンドラー
- `onChange?: (data: LEDPanelFormData) => void` - 変更ハンドラー
- `className?: string` - 追加CSSクラス

#### NumberInput
数値入力用の汎用コンポーネント。

**主な機能:**
- 単位表示（mm, m, 円など）
- バリデーションエラー表示
- 必須フィールド表示
- プレースホルダー
- min/max/step属性サポート

#### ErrorMessage
エラーメッセージを表示するシンプルなコンポーネント。

### Result Components (`results/`)

#### CalculationResult
LED Wall計算結果を表示するコンポーネント。

**主な機能:**
- パネル構成表示
- 解像度情報表示
- 物理サイズ表示
- 推奨視聴距離表示
- コスト見積もり表示（オプション）
- ローディング状態
- 空の状態メッセージ

**Props:**
- `result: LEDWallCalculationResult | null` - 計算結果
- `isLoading?: boolean` - ローディング状態
- `className?: string` - 追加CSSクラス

### Layout Components (`layout/`)

#### Header
アプリケーションのヘッダーコンポーネント。

**主な機能:**
- アプリケーション名とロゴ
- ナビゲーションリンク
- レスポンシブデザイン

#### Footer
アプリケーションのフッターコンポーネント。

**主な機能:**
- 著作権表示
- 外部リンク
- GitHubリンク

#### ErrorBoundary
Reactエラーバウンダリーコンポーネント。

**主な機能:**
- エラーキャッチ
- フォールバックUI表示
- エラー詳細表示
- リトライ機能

## 使用例

### フォームと結果の統合

```tsx
import { useState } from 'react';
import { LEDPanelForm } from '@/components/form';
import { CalculationResult } from '@/components/results';
import { calculateLEDWall } from '@/lib/calculations';

function MyPage() {
  const [result, setResult] = useState(null);

  const handleChange = (data) => {
    const input = {
      panelWidth: data.panelWidth,
      panelHeight: data.panelHeight,
      screenWidth: data.screenWidth,
      screenHeight: data.screenHeight,
      ledPitch: data.ledPitch,
    };
    
    const calculationResult = calculateLEDWall(input);
    setResult(calculationResult);
  };

  return (
    <div>
      <LEDPanelForm onChange={handleChange} />
      <CalculationResult result={result} />
    </div>
  );
}
```

### レイアウトの使用

```tsx
import { Header, Footer, ErrorBoundary } from '@/components/layout';

function App() {
  return (
    <ErrorBoundary>
      <Header />
      <main>
        {/* Your content */}
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
```

## スタイリング

すべてのコンポーネントはTailwind CSSを使用してスタイリングされています。

**カラーパレット:**
- Primary: `blue-600` / `blue-700`
- Background: `zinc-50` / `zinc-950` (ダークモード)
- Text: `zinc-900` / `zinc-50` (ダークモード)
- Border: `zinc-200` / `zinc-800` (ダークモード)
- Error: `red-600` / `red-400` (ダークモード)
- Success: `green-600` / `green-400` (ダークモード)

## アクセシビリティ

すべてのコンポーネントは以下のアクセシビリティ要件を満たしています:

- セマンティックHTML要素の使用
- ARIA属性の適切な使用
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 適切なコントラスト比

## テスト

コンポーネントはStorybookを使用してテストおよびドキュメント化されています。

```bash
npm run storybook
```
