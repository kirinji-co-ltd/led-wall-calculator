/**
 * LED Panel Data Management Module
 * 
 * Centralized module for managing LED panel data with:
 * - Type-safe panel creation and validation
 * - Easy extensibility for adding new panel models
 * - Data integrity checks
 * - Helper utilities for panel management
 */

import type {
  LEDPanelModel,
  LEDPanelModelInput,
  PanelValidationResult,
} from '@/types/ledPanel';
import { PANEL_CONSTRAINTS } from '@/types/ledPanel';

/**
 * Validates a panel model's data
 * Ensures all required fields are present and values are within acceptable ranges
 */
export function validatePanelModel(panel: LEDPanelModelInput): PanelValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (!panel.modelNumber || panel.modelNumber.trim() === '') {
    errors.push('Model number is required');
  }
  if (!panel.displayName || panel.displayName.trim() === '') {
    errors.push('Display name is required');
  }
  if (!panel.series || panel.series.trim() === '') {
    errors.push('Series is required');
  }
  if (!panel.description || panel.description.trim() === '') {
    errors.push('Description is required');
  }

  // Numeric field validations
  if (panel.panelWidth < PANEL_CONSTRAINTS.panelWidth.min || panel.panelWidth > PANEL_CONSTRAINTS.panelWidth.max) {
    errors.push(`Panel width must be between ${PANEL_CONSTRAINTS.panelWidth.min} and ${PANEL_CONSTRAINTS.panelWidth.max}mm`);
  }
  if (panel.panelHeight < PANEL_CONSTRAINTS.panelHeight.min || panel.panelHeight > PANEL_CONSTRAINTS.panelHeight.max) {
    errors.push(`Panel height must be between ${PANEL_CONSTRAINTS.panelHeight.min} and ${PANEL_CONSTRAINTS.panelHeight.max}mm`);
  }
  if (panel.pixelPitch < PANEL_CONSTRAINTS.pixelPitch.min || panel.pixelPitch > PANEL_CONSTRAINTS.pixelPitch.max) {
    errors.push(`Pixel pitch must be between ${PANEL_CONSTRAINTS.pixelPitch.min} and ${PANEL_CONSTRAINTS.pixelPitch.max}mm`);
  }
  if (panel.brightness < PANEL_CONSTRAINTS.brightness.min || panel.brightness > PANEL_CONSTRAINTS.brightness.max) {
    errors.push(`Brightness must be between ${PANEL_CONSTRAINTS.brightness.min} and ${PANEL_CONSTRAINTS.brightness.max} nits`);
  }

  // Optional field validations
  if (panel.refreshRate !== undefined) {
    if (panel.refreshRate < PANEL_CONSTRAINTS.refreshRate.min || panel.refreshRate > PANEL_CONSTRAINTS.refreshRate.max) {
      errors.push(`Refresh rate must be between ${PANEL_CONSTRAINTS.refreshRate.min} and ${PANEL_CONSTRAINTS.refreshRate.max}Hz`);
    }
  }
  if (panel.viewingAngle !== undefined) {
    if (panel.viewingAngle < PANEL_CONSTRAINTS.viewingAngle.min || panel.viewingAngle > PANEL_CONSTRAINTS.viewingAngle.max) {
      errors.push(`Viewing angle must be between ${PANEL_CONSTRAINTS.viewingAngle.min} and ${PANEL_CONSTRAINTS.viewingAngle.max} degrees`);
    }
  }
  if (panel.weight !== undefined) {
    if (panel.weight < PANEL_CONSTRAINTS.weight.min || panel.weight > PANEL_CONSTRAINTS.weight.max) {
      errors.push(`Weight must be between ${PANEL_CONSTRAINTS.weight.min} and ${PANEL_CONSTRAINTS.weight.max}kg`);
    }
  }
  if (panel.powerConsumption !== undefined) {
    if (panel.powerConsumption < PANEL_CONSTRAINTS.powerConsumption.min || panel.powerConsumption > PANEL_CONSTRAINTS.powerConsumption.max) {
      errors.push(`Power consumption must be between ${PANEL_CONSTRAINTS.powerConsumption.min} and ${PANEL_CONSTRAINTS.powerConsumption.max}W`);
    }
  }
  if (panel.pricePerPanel !== undefined) {
    if (panel.pricePerPanel < PANEL_CONSTRAINTS.pricePerPanel.min || panel.pricePerPanel > PANEL_CONSTRAINTS.pricePerPanel.max) {
      errors.push(`Price per panel must be between ${PANEL_CONSTRAINTS.pricePerPanel.min} and ${PANEL_CONSTRAINTS.pricePerPanel.max} yen`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a unique panel ID from model details
 * Format: {series-slug}-p{pixelPitch}
 * Example: "q-plus-p2.5"
 */
export function generatePanelId(panel: LEDPanelModelInput): string {
  if (panel.id) {
    return panel.id;
  }

  const seriesSlug = panel.series.toLowerCase().replace(/\+/g, '-plus').replace(/\s+/g, '-');
  const pitchStr = panel.pixelPitch.toString().replace('.', '');
  return `${seriesSlug}-p${pitchStr}`;
}

/**
 * Creates a new LED panel model with validation
 * Throws an error if validation fails
 */
export function createPanelModel(input: LEDPanelModelInput): LEDPanelModel {
  const validation = validatePanelModel(input);
  
  if (!validation.isValid) {
    throw new Error(`Invalid panel model: ${validation.errors.join(', ')}`);
  }

  const id = generatePanelId(input);

  return {
    ...input,
    id,
  };
}

/**
 * Creates multiple panel models with validation
 * Returns valid panels and collects errors for invalid ones
 */
export function createPanelModels(
  inputs: LEDPanelModelInput[]
): { panels: LEDPanelModel[]; errors: Array<{ input: LEDPanelModelInput; errors: string[] }> } {
  const panels: LEDPanelModel[] = [];
  const errors: Array<{ input: LEDPanelModelInput; errors: string[] }> = [];

  for (const input of inputs) {
    const validation = validatePanelModel(input);
    
    if (validation.isValid) {
      const id = generatePanelId(input);
      panels.push({ ...input, id });
    } else {
      errors.push({ input, errors: validation.errors });
    }
  }

  return { panels, errors };
}

/**
 * Type guard to check if a value is a valid LED panel model
 */
export function isValidPanelModel(value: unknown): value is LEDPanelModel {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const panel = value as Partial<LEDPanelModel>;
  
  return (
    typeof panel.id === 'string' &&
    typeof panel.modelNumber === 'string' &&
    typeof panel.displayName === 'string' &&
    typeof panel.series === 'string' &&
    typeof panel.panelWidth === 'number' &&
    typeof panel.panelHeight === 'number' &&
    typeof panel.pixelPitch === 'number' &&
    typeof panel.brightness === 'number' &&
    typeof panel.description === 'string'
  );
}

/**
 * Validates an array of panel models
 * Returns validation results for all panels
 */
export function validatePanelModels(
  panels: LEDPanelModelInput[]
): Array<{ panel: LEDPanelModelInput; validation: PanelValidationResult }> {
  return panels.map(panel => ({
    panel,
    validation: validatePanelModel(panel),
  }));
}

/**
 * Helper function to safely parse panel data from JSON
 * Returns panels array or throws with detailed error
 */
export function parsePanelDataFromJSON(jsonString: string): LEDPanelModel[] {
  try {
    const data = JSON.parse(jsonString);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON data must be an array of panel objects');
    }

    const { panels, errors } = createPanelModels(data);

    if (errors.length > 0) {
      const errorMessages = errors.map(
        ({ input, errors }) => `Panel "${input.modelNumber}": ${errors.join(', ')}`
      );
      throw new Error(`Invalid panel data:\n${errorMessages.join('\n')}`);
    }

    return panels;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    }
    throw error;
  }
}
