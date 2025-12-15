# LED Panel Data Management Guide

This guide explains how to manage LED panel data in the LED Wall Calculator application, including adding new panel models, validating data, and using the extensible panel management system.

## Overview

The LED panel data management system provides:

- **Type-safe panel creation**: TypeScript types ensure data integrity
- **Automatic validation**: All panel data is validated against constraints
- **Easy extensibility**: Adding new panels is straightforward and safe
- **Multiple input formats**: Support for TypeScript objects and JSON data
- **Data integrity checks**: Built-in validation prevents invalid data

## Architecture

### Core Files

- **`src/types/ledPanel.ts`**: Type definitions and validation constraints
- **`src/lib/panels.ts`**: Panel data management utilities and validation functions
- **`src/lib/panelModels.ts`**: Panel database with all available panel models

## Adding a New Panel Model

### Method 1: Direct TypeScript (Recommended)

1. Open `src/lib/panelModels.ts`
2. Add your panel data to the `panelModelsData` array:

```typescript
const panelModelsData: LEDPanelModelInput[] = [
  // ... existing panels ...
  {
    // Required fields
    modelNumber: 'Q+5.0',           // Model identification
    displayName: 'Q+5.0',           // Display name in UI
    series: 'Q+',                   // Product series
    panelWidth: 640,                // Panel width in mm
    panelHeight: 480,               // Panel height in mm
    pixelPitch: 5.0,                // LED pixel pitch in mm
    brightness: 1500,               // Brightness in nits
    description: '大型イベント向けLEDパネル',  // Japanese description
    
    // Optional fields
    refreshRate: 3840,              // Refresh rate in Hz
    viewingAngle: 160,              // Viewing angle in degrees
    weight: 10.0,                   // Weight in kg
    powerConsumption: 300,          // Power consumption in watts
    useCase: 'コンサート、スタジアム',  // Recommended use cases
    pricePerPanel: 150000,          // Price per panel in yen
    imageUrl: '/images/panels/q-plus-5.0.jpg',  // Optional image
  },
];
```

3. The system will automatically:
   - Generate a unique ID (e.g., `q-plus-p50`)
   - Validate all fields against constraints
   - Add the panel to the available models

4. Run tests to verify:

```bash
npm test -- src/lib/panelModels.test.ts
```

### Method 2: JSON Import

For bulk imports or external data sources:

```typescript
import { parsePanelDataFromJSON } from '@/lib/panels';

const jsonData = `[
  {
    "modelNumber": "Q+5.0",
    "displayName": "Q+5.0",
    "series": "Q+",
    "panelWidth": 640,
    "panelHeight": 480,
    "pixelPitch": 5.0,
    "brightness": 1500,
    "description": "大型イベント向けLEDパネル"
  }
]`;

try {
  const panels = parsePanelDataFromJSON(jsonData);
  console.log(`Successfully loaded ${panels.length} panels`);
} catch (error) {
  console.error('Failed to parse panel data:', error.message);
}
```

## Field Specifications

### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `modelNumber` | string | Model identification (e.g., "Q+2.5") | Non-empty |
| `displayName` | string | Display name in UI | Non-empty |
| `series` | string | Product series (e.g., "Q+") | Non-empty |
| `panelWidth` | number | Panel width in mm | 100-5000mm |
| `panelHeight` | number | Panel height in mm | 100-5000mm |
| `pixelPitch` | number | LED pixel pitch in mm | 0.5-50mm |
| `brightness` | number | Brightness in nits/cd/m² | 100-10000 nits |
| `description` | string | Panel description | Non-empty |

### Optional Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | string | Unique identifier | Auto-generated if not provided |
| `refreshRate` | number | Refresh rate in Hz | 60-7680Hz |
| `viewingAngle` | number | Viewing angle in degrees | 10-180° |
| `weight` | number | Weight in kg | 0.1-100kg |
| `powerConsumption` | number | Power consumption in watts | 10-2000W |
| `useCase` | string | Recommended use cases | Any string |
| `pricePerPanel` | number | Price per panel in yen | 0-10,000,000¥ |
| `imageUrl` | string | Panel image URL/path | Any string |

## Validation

### Automatic Validation

All panel data is automatically validated when added. The system checks:

1. **Required fields**: All mandatory fields must be present and non-empty
2. **Type checking**: Fields must be the correct type (string, number)
3. **Range validation**: Numeric fields must be within acceptable ranges
4. **Business logic**: Data must make practical sense

### Manual Validation

You can manually validate panel data:

```typescript
import { validatePanelModel } from '@/lib/panels';

const panelData = {
  modelNumber: 'Q+2.5',
  // ... other fields
};

const validation = validatePanelModel(panelData);

if (validation.isValid) {
  console.log('Panel data is valid');
} else {
  console.error('Validation errors:', validation.errors);
}
```

### Type Guards

Check if a value is a valid panel model:

```typescript
import { isValidPanelModel } from '@/lib/panels';

if (isValidPanelModel(data)) {
  // TypeScript now knows 'data' is a LEDPanelModel
  console.log(data.modelNumber);
}
```

## Helper Functions

### Create Single Panel

```typescript
import { createPanelModel } from '@/lib/panels';

try {
  const panel = createPanelModel({
    modelNumber: 'Q+2.5',
    displayName: 'Q+2.5',
    series: 'Q+',
    panelWidth: 640,
    panelHeight: 480,
    pixelPitch: 2.5,
    brightness: 1000,
    description: 'Test panel',
  });
  console.log('Created panel:', panel.id);
} catch (error) {
  console.error('Failed to create panel:', error.message);
}
```

### Create Multiple Panels

```typescript
import { createPanelModels } from '@/lib/panels';

const panelInputs = [
  { /* panel 1 data */ },
  { /* panel 2 data */ },
];

const { panels, errors } = createPanelModels(panelInputs);

console.log(`Created ${panels.length} panels`);
if (errors.length > 0) {
  console.error('Some panels failed validation:', errors);
}
```

### Generate Panel ID

```typescript
import { generatePanelId } from '@/lib/panels';

const id = generatePanelId({
  series: 'Q+',
  pixelPitch: 2.5,
  // ... other fields
});

console.log(id); // "q-plus-p25"
```

## Best Practices

### 1. Use Type-Safe Input

Always use the `LEDPanelModelInput` type for new panel data:

```typescript
import type { LEDPanelModelInput } from '@/types/ledPanel';

const newPanel: LEDPanelModelInput = {
  // TypeScript will enforce all required fields
};
```

### 2. Validate Before Adding

Although validation is automatic, you can pre-validate:

```typescript
const validation = validatePanelModel(newPanel);
if (validation.isValid) {
  // Add to panelModelsData array
}
```

### 3. Run Tests

After adding panels, always run tests:

```bash
npm test -- src/lib/panelModels.test.ts
npm test -- src/lib/panels.test.ts
```

### 4. Use Descriptive Names

- Use clear, consistent naming for `modelNumber`
- Include series information in `displayName`
- Write detailed Japanese descriptions

### 5. Provide Complete Data

While some fields are optional, providing complete data improves:
- User experience
- Calculation accuracy
- Feature completeness

## Examples

### Adding a High-End Indoor Panel

```typescript
{
  modelNumber: 'Q+1.2',
  displayName: 'Q+1.2',
  series: 'Q+',
  panelWidth: 600,
  panelHeight: 337.5,
  pixelPitch: 1.2,
  brightness: 800,
  refreshRate: 3840,
  viewingAngle: 160,
  weight: 6.0,
  powerConsumption: 160,
  description: '最高解像度の屋内用LEDパネル、至近距離での視聴に最適',
  useCase: '高級会議室、放送スタジオ、ショールーム',
  pricePerPanel: 200000,
}
```

### Adding an Outdoor Panel

```typescript
{
  modelNumber: 'OP6.0',
  displayName: 'Outdoor Pro 6.0',
  series: 'Outdoor Pro',
  panelWidth: 960,
  panelHeight: 960,
  pixelPitch: 6.0,
  brightness: 6000,
  refreshRate: 1920,
  viewingAngle: 140,
  weight: 25.0,
  powerConsumption: 600,
  description: '高輝度屋外用LEDパネル、直射日光下でも鮮明な表示',
  useCase: 'ビルボード、スタジアム、屋外イベント',
  pricePerPanel: 300000,
}
```

### Adding a Budget Panel

```typescript
{
  modelNumber: 'E4.0',
  displayName: 'Economy 4.0',
  series: 'Economy',
  panelWidth: 500,
  panelHeight: 500,
  pixelPitch: 4.0,
  brightness: 1000,
  viewingAngle: 140,
  weight: 7.0,
  powerConsumption: 200,
  description: 'コストパフォーマンスに優れた標準LEDパネル',
  useCase: '展示会、小規模イベント、店舗',
  pricePerPanel: 80000,
}
```

## Troubleshooting

### Validation Errors

If you encounter validation errors:

1. **Check required fields**: Ensure all mandatory fields are present
2. **Verify value ranges**: Check constraints in `PANEL_CONSTRAINTS`
3. **Check types**: Ensure numbers are numbers, strings are strings
4. **Review error messages**: They indicate exactly what's wrong

### ID Conflicts

If you get duplicate ID errors:

1. The system auto-generates IDs from series and pitch
2. Provide a custom `id` field if auto-generation creates duplicates
3. Ensure IDs are unique across all panels

### Import Errors

If TypeScript shows import errors:

1. Run `npm run tsc` to check for type errors
2. Ensure all imports use correct paths (`@/lib/panels`)
3. Check that types are exported correctly

## Testing

### Unit Tests

Test new panels:

```bash
npm test -- src/lib/panelModels.test.ts
npm test -- src/lib/panels.test.ts
```

### Integration Tests

Run full test suite:

```bash
npm test
```

### Type Checking

Verify TypeScript types:

```bash
npm run tsc
```

## Migration Guide

### From Old Format

If you have old panel data:

```typescript
// Old format (direct array)
const oldPanels = [
  { id: 'q-plus-p2.5', modelNumber: 'Q+2.5', /* ... */ }
];

// New format (use LEDPanelModelInput)
const newPanels: LEDPanelModelInput[] = [
  { modelNumber: 'Q+2.5', /* ... */ }  // ID is optional
];
```

### Benefits of New Format

1. **Automatic validation**: Catches errors immediately
2. **Auto-generated IDs**: No need to manually create IDs
3. **Type safety**: TypeScript enforces correct structure
4. **Better error messages**: Clear indication of what's wrong

## Support

For questions or issues:

1. Check this documentation
2. Review test files for examples
3. Check TypeScript types in `types/ledPanel.ts`
4. Review validation constraints in `PANEL_CONSTRAINTS`

## Future Enhancements

Planned improvements:

- [ ] Support for panel variants (e.g., indoor/outdoor versions)
- [ ] Advanced filtering by multiple criteria
- [ ] Import from external databases
- [ ] Panel comparison features
- [ ] Bulk editing capabilities
- [ ] Version control for panel data
