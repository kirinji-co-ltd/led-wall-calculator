# Example: Adding a New LED Panel Model

This document demonstrates how easy it is to add a new LED panel model to the system.

## Scenario

You want to add a new panel model: **Q+6.0** - a large outdoor LED panel for stadium use.

## Step 1: Define Panel Data

Open `src/lib/panelModels.ts` and add the new panel to the `panelModelsData` array:

```typescript
const panelModelsData: LEDPanelModelInput[] = [
  // ... existing panels ...
  
  // New panel - Q+6.0
  {
    modelNumber: 'Q+6.0',
    displayName: 'Q+6.0',
    series: 'Q+',
    panelWidth: 576,
    panelHeight: 576,
    pixelPitch: 6.0,
    brightness: 5000,
    refreshRate: 3840,
    viewingAngle: 140,
    weight: 12.0,
    powerConsumption: 400,
    description: '大型スタジアム向け高輝度LEDパネル、遠距離視聴対応',
    useCase: 'スタジアム、大型イベント、屋外コンサート',
    pricePerPanel: 350000,
  },
];
```

## Step 2: Automatic Processing

The system automatically:

1. **Validates** all fields:
   - Checks required fields are present
   - Verifies values are within valid ranges
   - Ensures proper data types

2. **Generates ID**: Creates unique ID `q-plus-p60`

3. **Adds to database**: Panel becomes immediately available

## Step 3: Verify (Optional)

Run tests to confirm the new panel is valid:

```bash
npm test -- src/lib/panelModels.test.ts
```

## Step 4: Use the Panel

The new panel is now available throughout the application:

```typescript
import { panelModels, getPanelModelById } from '@/lib/panelModels';

// Get all panels (includes your new Q+6.0)
console.log(panelModels);

// Get specific panel
const q60 = getPanelModelById('q-plus-p60');
console.log(q60.brightness); // 5000
```

## What You Get

After adding the panel, it's automatically available in:

- ✅ Panel selector UI
- ✅ Calculation engine
- ✅ Search and filter functionality
- ✅ Type-safe throughout the app
- ✅ Validated for data integrity

## Error Handling Example

If you make a mistake, the system catches it immediately:

```typescript
// WRONG: Invalid brightness value
{
  modelNumber: 'Q+6.0',
  brightness: 50,  // ❌ Too low! (min: 100 nits)
  // ... other fields
}
```

Error message:
```
Invalid panel model data detected:
Panel "Q+6.0": Brightness must be between 100 and 10000 nits
```

## Advanced: Adding Multiple Panels at Once

You can add several panels in one go:

```typescript
const panelModelsData: LEDPanelModelInput[] = [
  // ... existing panels ...
  
  // Add multiple new panels
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
  },
  {
    modelNumber: 'Q+7.8',
    displayName: 'Q+7.8',
    series: 'Q+',
    panelWidth: 500,
    panelHeight: 500,
    pixelPitch: 7.8,
    brightness: 6000,
    description: '超大型屋外LEDパネル',
    useCase: 'ビルボード、大型スクリーン',
  },
  {
    modelNumber: 'Q+0.9',
    displayName: 'Q+0.9',
    series: 'Q+',
    panelWidth: 600,
    panelHeight: 337.5,
    pixelPitch: 0.9,
    brightness: 600,
    description: '超高解像度LEDパネル、近接視聴用',
    useCase: '放送スタジオ、高級ショールーム',
  },
];
```

All panels are validated and added together!

## Benefits of This System

1. **Type Safety**: TypeScript prevents typos and wrong types
2. **Validation**: Catches invalid data before it causes problems
3. **Auto ID**: No manual ID management needed
4. **Easy**: Just add data - no complex code required
5. **Documented**: Clear constraints and field requirements
6. **Tested**: Comprehensive test coverage ensures reliability

## Complete Example with All Fields

Here's a complete panel definition using all available fields:

```typescript
{
  // Required fields
  modelNumber: 'Q+6.0',
  displayName: 'Q+6.0 Stadium Edition',
  series: 'Q+',
  panelWidth: 576,
  panelHeight: 576,
  pixelPitch: 6.0,
  brightness: 5000,
  description: '大型スタジアム向け高輝度LEDパネル、遠距離視聴対応',
  
  // Optional but recommended
  refreshRate: 3840,
  viewingAngle: 140,
  weight: 12.0,
  powerConsumption: 400,
  useCase: 'スタジアム、大型イベント、屋外コンサート',
  pricePerPanel: 350000,
  
  // Optional - useful if you have images
  imageUrl: '/images/panels/q-plus-6.0.jpg',
  
  // Optional - custom ID (usually not needed)
  // id: 'custom-id',  // Auto-generated if not provided
}
```

## Troubleshooting

### Problem: "Model number is required" error

**Solution**: Ensure `modelNumber` field is present and not empty.

### Problem: "Brightness must be between 100 and 10000 nits" error

**Solution**: Check your brightness value is within the valid range.

### Problem: Tests fail after adding panel

**Solution**: Review the error message - it tells you exactly what's wrong. Fix the invalid field values.

### Problem: TypeScript shows type errors

**Solution**: Make sure you're using `LEDPanelModelInput` type and all required fields are present.

## Next Steps

After successfully adding your panel:

1. **Test the UI**: Run the dev server and see your panel in the selector
2. **Verify calculations**: Test that calculations work with your panel
3. **Update documentation**: If your panel introduces a new series, update docs
4. **Add images**: Consider adding panel images for better UX

## Resources

- Full documentation: `PANEL_DATA_MANAGEMENT.md`
- Type definitions: `src/types/ledPanel.ts`
- Validation utilities: `src/lib/panels.ts`
- Panel database: `src/lib/panelModels.ts`
- Tests: `src/lib/panels.test.ts`
