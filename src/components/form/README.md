# LED Panel Form Components

LEDウォール計算機の入力フォームコンポーネント群

## コンポーネント一覧

### LEDPanelForm

LEDパネル仕様の入力フォームコンポーネント。バリデーション機能付き。

#### 使用例

```tsx
import { LEDPanelForm } from '@/components/form';

function MyPage() {
  const handleSubmit = (data) => {
    console.log('Form data:', data);
  };

  return <LEDPanelForm onSubmit={handleSubmit} />;
}
```

#### Props

- `initialValues?: Partial<LEDPanelFormData>` - 初期値
- `onSubmit?: (data: LEDPanelFormData) => void` - 送信時のコールバック
- `onChange?: (data: LEDPanelFormData) => void` - 変更時のコールバック（リアルタイム更新）
- `className?: string` - 追加のCSSクラス

### NumberInput

数値入力専用の入力コンポーネント。単位表示とバリデーション機能付き。

#### 使用例

```tsx
import { NumberInput } from '@/components/form';

function MyComponent() {
  const [value, setValue] = useState(0);

  return (
    <NumberInput
      label="LEDパネル幅"
      name="panelWidth"
      value={value}
      onChange={setValue}
      unit="mm"
      required
    />
  );
}
```

#### Props

- `label: string` - ラベル
- `name: string` - 入力フィールドのname/id
- `value: number | string` - 現在の値
- `onChange: (value: number) => void` - 変更ハンドラ
- `onBlur?: () => void` - フォーカスが外れた時のハンドラ
- `min?: number` - 最小値（デフォルト: 0）
- `max?: number` - 最大値
- `step?: number` - ステップ値（デフォルト: 1）
- `unit?: string` - 単位表示（例: "mm", "m", "円"）
- `required?: boolean` - 必須フィールドか（デフォルト: false）
- `error?: string` - エラーメッセージ
- `placeholder?: string` - プレースホルダー
- `className?: string` - 追加のCSSクラス
- `disabled?: boolean` - 無効状態

### ErrorMessage

エラーメッセージ表示用コンポーネント。

#### 使用例

```tsx
import { ErrorMessage } from '@/components/form';

function MyComponent() {
  return <ErrorMessage message="エラーが発生しました" />;
}
```

#### Props

- `message?: string` - 表示するエラーメッセージ
- `className?: string` - 追加のCSSクラス

## 入力フィールド

以下のフィールドが含まれています：

1. **LEDパネル幅** (mm) - 必須
2. **LEDパネル高さ** (mm) - 必須
3. **画面幅** (枚数) - 必須、整数のみ
4. **画面高さ** (枚数) - 必須、整数のみ
5. **LEDピッチ** (mm) - 必須
6. **視聴距離** (m) - 必須
7. **予算範囲** (円) - 必須

## バリデーション

各フィールドには以下のバリデーションが適用されます：

- **パネルサイズ（幅・高さ）**: 0 < value ≤ 10,000mm
- **画面サイズ（幅・高さ）**: 1 ≤ value ≤ 100枚、整数のみ
- **LEDピッチ**: 0 < value ≤ 100mm
- **視聴距離**: 0 < value ≤ 1,000m
- **予算**: value ≥ 0円

バリデーションはリアルタイムで実行され、フォーカスが外れた際にエラーメッセージが表示されます。

## アクセシビリティ

- ラベルと入力フィールドの適切な関連付け
- エラーメッセージのaria-live属性による通知
- 必須フィールドの明示
- キーボードナビゲーション対応

## レスポンシブデザイン

- デスクトップ: 2カラムレイアウト
- タブレット/モバイル: 1カラムレイアウト
- すべての画面サイズで適切な余白とサイズ調整

## Storybook

各コンポーネントのストーリーが用意されています：

```bash
npm run storybook
```

- `Form/ErrorMessage` - エラーメッセージコンポーネント
- `Form/NumberInput` - 数値入力コンポーネント
- `Form/LEDPanelForm` - LEDパネルフォーム
