# LEDウォール計算機 / LED Wall Calculator

LEDパネルの仕様を入力して、画面サイズ、解像度、視聴距離などを計算するツールです。

This is a [Next.js](https://nextjs.org) project for calculating LED wall specifications including screen size, resolution, and viewing distance.

## Features

- 🧮 **リアルタイム計算** - Real-time calculation of LED wall specifications
- 📊 **詳細な結果表示** - Detailed results with visual preview
- 🎨 **プリセット機能** - Built-in and custom presets for common panel configurations
- 🔧 **拡張可能なパネルデータ** - Extensible LED panel data management with type safety
- ♿ **フルアクセシビリティ対応** - WCAG 2.1 AA compliant with keyboard navigation
- 🌙 **ダークモード対応** - Dark mode support
- 📱 **レスポンシブデザイン** - Mobile-friendly responsive design
- ✅ **包括的なテスト** - Comprehensive test coverage with accessibility testing

## Getting Started

### Development Server

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npx vitest run --config vitest.unit.config.ts --coverage
```

### E2E Tests

Run end-to-end tests with Playwright:

```bash
# Run E2E tests
npm run test:e2e

# UI mode
npm run test:e2e:ui

# Headed mode (visible browser)
npm run test:e2e:headed
```

### Storybook

View and test components in isolation:

```bash
npm run storybook
```

## Accessibility

このアプリケーションはWCAG 2.1 AAレベルに準拠しています。
This application complies with WCAG 2.1 Level AA standards.

- ✅ Full keyboard navigation support
- ✅ Screen reader compatible
- ✅ Proper ARIA attributes
- ✅ Focus management
- ✅ Color contrast compliance (4.5:1+)
- ✅ Automated accessibility testing with axe-core

詳細は [ACCESSIBILITY.md](./ACCESSIBILITY.md) をご覧ください。
For details, see [ACCESSIBILITY.md](./ACCESSIBILITY.md).

## LED Panel Data Management

新しいLEDパネルモデルの追加は簡単で型安全です。
Adding new LED panel models is easy and type-safe.

### Quick Start

1. Open `src/lib/panelModels.ts`
2. Add your panel data to the `panelModelsData` array
3. The system automatically validates and generates IDs
4. Your panel is immediately available throughout the app

### Example

```typescript
{
  modelNumber: 'Q+6.0',
  displayName: 'Q+6.0',
  series: 'Q+',
  panelWidth: 576,
  panelHeight: 576,
  pixelPitch: 6.0,
  brightness: 5000,
  description: '大型スタジアム向けLEDパネル',
  useCase: 'スタジアム、大型イベント',
}
```

### Documentation

- 📖 **[Panel Data Management Guide](./PANEL_DATA_MANAGEMENT.md)** - Complete documentation
- 📝 **[Adding New Panel Example](./ADDING_NEW_PANEL_EXAMPLE.md)** - Step-by-step example
- 🔍 **Type Definitions**: `src/types/ledPanel.ts`
- 🛠️ **Utilities**: `src/lib/panels.ts`
- 📦 **Panel Database**: `src/lib/panelModels.ts`

### Features

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Auto-validation** - Data integrity checks
- ✅ **Auto-ID generation** - No manual ID management
- ✅ **Extensible** - Easy to add new fields
- ✅ **JSON support** - Import from external sources
- ✅ **Comprehensive tests** - 28+ validation tests

## Project Structure

```
led-wall-calculator/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── form/        # Form components
│   │   ├── layout/      # Layout components
│   │   └── results/     # Results display components
│   ├── lib/             # Utility functions and calculations
│   └── types/           # TypeScript type definitions
├── e2e/                 # Playwright E2E tests
├── public/              # Static assets
└── .storybook/          # Storybook configuration
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Testing**: 
  - Vitest (Unit tests)
  - React Testing Library
  - Playwright (E2E tests)
  - vitest-axe (Accessibility testing)
- **Development Tools**:
  - Storybook (Component development)
  - ESLint (Linting)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is open source and available under the MIT License.
