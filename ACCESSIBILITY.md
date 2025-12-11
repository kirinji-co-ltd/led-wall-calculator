# アクセシビリティ対応ガイド

このドキュメントでは、LEDウォール計算機のアクセシビリティ機能とテストについて説明します。

## 実装されたアクセシビリティ機能

### キーボードナビゲーション

すべてのインタラクティブな要素はキーボードだけで操作できます。

#### サポートされているキーボード操作

- **Tab / Shift+Tab**: フォーカスの移動
- **Enter / Space**: ボタンやオプションの選択
- **Escape**: モーダルやドロップダウンを閉じる
- **Arrow Up / Arrow Down**: プリセット選択での項目間移動
- **Home / End**: プリセットリストの最初/最後の項目に移動

#### 具体的な実装

##### プリセットセレクター
- `Enter`キーでドロップダウンを開く
- 矢印キーで項目間を移動
- `Enter`または`Space`キーで選択
- `Escape`キーで閉じる
- 選択後はボタンにフォーカスが戻る

##### プリセット管理モーダル
- `Escape`キーでモーダルを閉じる
- フォーカストラップ実装済み（モーダル内でTabキーでの循環）
- モーダルを開くと閉じるボタンに自動フォーカス
- モーダルを閉じると元のトリガーボタンにフォーカスが戻る

### ARIA属性

すべての要素に適切なARIA属性が設定されています。

#### 実装されているARIA属性

- **role="dialog"**: モーダルダイアログ
- **aria-modal="true"**: モーダルであることを示す
- **aria-labelledby**: モーダルのタイトルとの関連付け
- **role="listbox"**: プリセットセレクターのドロップダウン
- **role="option"**: リストボックス内の各オプション
- **aria-selected**: 選択されているオプションを示す
- **aria-haspopup="listbox"**: ドロップダウンを持つボタン
- **aria-expanded**: ドロップダウンの開閉状態
- **aria-invalid**: バリデーションエラーのある入力フィールド
- **aria-describedby**: エラーメッセージとの関連付け
- **aria-label**: アクセシブルな名前を提供
- **aria-hidden="true"**: 装飾的な要素を支援技術から隠す
- **aria-live="polite"**: 動的なコンテンツの変更を通知

### セマンティックHTML

意味のあるHTML要素を使用しています。

- `<header>`: ページヘッダー
- `<main>`: メインコンテンツエリア
- `<footer>`: ページフッター
- `<nav>`: ナビゲーションエリア
- `<button>`: インタラクティブなボタン（`<div>`ではない）
- `<label>`: フォーム入力との関連付け

### フォーム入力

すべてのフォーム入力は適切にラベル付けされています。

- すべての入力フィールドに関連付けられた`<label>`
- 必須フィールドには視覚的および機械的な表示（`required`属性）
- エラーメッセージは`aria-describedby`で入力フィールドと関連付け
- バリデーションエラーは`aria-invalid="true"`で示される

### フォーカス表示

キーボードユーザーのために明確なフォーカス表示を提供しています。

- すべてのインタラクティブ要素にフォーカスリングを表示
- `focus:outline-none focus:ring-2 focus:ring-blue-500`クラスを使用
- ダークモード対応のフォーカス表示

### カラーコントラスト

WCAG 2.1 AAレベルのカラーコントラスト比（4.5:1以上）を確保しています。

- テキストと背景のコントラスト
- ダークモードでも適切なコントラスト
- axe-coreによる自動チェック

## テスト

### 単体テスト（Vitest + React Testing Library）

```bash
# すべてのテストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# カバレッジレポートを生成
npx vitest run --config vitest.unit.config.ts --coverage
```

#### テストされているコンポーネント

- **NumberInput**: フォーム入力、バリデーション、アクセシビリティ
- **PresetSelector**: キーボードナビゲーション、ARIA属性、ドロップダウン動作
- **Header / Footer**: レンダリング、ナビゲーションリンク
- **calculations.ts**: 計算ロジック（100%カバレッジ）
- **formatters.ts**: データフォーマッティング（100%カバレッジ）

### アクセシビリティテスト

各コンポーネントテストにaxe-coreを使用した自動アクセシビリティチェックが含まれています。

```typescript
import { axe } from 'vitest-axe';

it('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2Eテスト（Playwright）

```bash
# E2Eテストを実行（すべてのブラウザ）
npm run test:e2e

# UIモードでE2Eテストを実行
npm run test:e2e:ui

# ヘッド付きモードでE2Eテストを実行
npm run test:e2e:headed
```

#### E2Eテストスイート

##### calculator.spec.ts
- 基本的な計算フロー
- フォーム入力とバリデーション
- プリセット選択
- キーボードナビゲーション
- モーダルの開閉
- フォーカストラップ
- レスポンシブデザイン

##### accessibility.spec.ts
- WCAG 2.1 AAレベルの自動チェック
- フォーム入力のラベル確認
- 見出し階層の確認
- キーボードナビゲーション
- フォーカス表示
- ARIA role属性の確認
- カラーコントラストチェック
- スクリーンリーダーナビゲーション

## WCAG 2.1 AAコンプライアンス

このアプリケーションは以下のWCAG 2.1 AAガイドラインに準拠しています：

### 知覚可能（Perceivable）
- ✅ 1.1.1 非テキストコンテンツ: すべての画像に代替テキスト
- ✅ 1.3.1 情報と関係性: セマンティックHTMLとARIA属性
- ✅ 1.4.3 コントラスト（最小）: 4.5:1以上のコントラスト比

### 操作可能（Operable）
- ✅ 2.1.1 キーボード: すべての機能はキーボードで利用可能
- ✅ 2.1.2 キーボードトラップなし: 適切なフォーカス管理
- ✅ 2.4.3 フォーカス順序: 論理的なTab順序
- ✅ 2.4.7 フォーカスの可視化: 明確なフォーカス表示

### 理解可能（Understandable）
- ✅ 3.2.1 フォーカス時: 予期しない動作なし
- ✅ 3.2.2 入力時: 自動的なコンテキスト変更なし
- ✅ 3.3.1 エラーの特定: 明確なエラーメッセージ
- ✅ 3.3.2 ラベルまたは説明: すべての入力にラベル

### 堅牢（Robust）
- ✅ 4.1.2 名前、役割、値: 適切なARIA属性
- ✅ 4.1.3 ステータスメッセージ: aria-liveリージョン

## ベストプラクティス

### コンポーネント開発時

1. **セマンティックHTMLを使用**
   - 適切な要素を選択（例：`<button>`、`<nav>`、`<main>`）
   - `<div>`のボタン化を避ける

2. **ARIA属性を適切に設定**
   - 必要な場合のみARIAを使用（セマンティックHTMLが優先）
   - role、aria-label、aria-describedbyなどを適切に使用

3. **キーボードナビゲーションをテスト**
   - すべてのインタラクティブ要素にTabでアクセス可能か確認
   - Enter、Space、Escapeキーの動作を実装

4. **フォーカス管理**
   - モーダルを開いたときの初期フォーカス
   - モーダルを閉じたときのフォーカス復帰
   - フォーカストラップの実装

5. **アクセシビリティテストを追加**
   ```typescript
   it('should be accessible', async () => {
     const { container } = render(<YourComponent />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

## 参考リンク

- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [axe-core ルール](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Testing Library アクセシビリティガイド](https://testing-library.com/docs/queries/about/#priority)
- [Playwright アクセシビリティテスト](https://playwright.dev/docs/accessibility-testing)

## トラブルシューティング

### フォーカスが見えない
- ブラウザの開発者ツールで`:focus`スタイルを確認
- `focus:outline-none`を削除して`focus:ring-*`クラスを追加

### スクリーンリーダーで読み上げられない
- `aria-label`または`aria-labelledby`属性を追加
- `aria-hidden="true"`が誤って設定されていないか確認

### キーボードでアクセスできない
- `tabindex="-1"`が不適切に使用されていないか確認
- イベントリスナーが適切に設定されているか確認
- `<div>`の代わりに`<button>`を使用

### axeテストが失敗する
- エラーメッセージを読んで具体的な問題を特定
- [axe-core ルールドキュメント](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)を参照
- 必要に応じて特定のルールを除外（正当な理由がある場合のみ）
