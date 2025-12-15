import { describe, it, expect } from 'vitest';
import {
  validatePanelModel,
  generatePanelId,
  createPanelModel,
  createPanelModels,
  isValidPanelModel,
  validatePanelModels,
  parsePanelDataFromJSON,
} from './panels';
import type { LEDPanelModelInput } from '@/types/ledPanel';

describe('Panel Data Management', () => {
  const validPanelInput: LEDPanelModelInput = {
    modelNumber: 'Q+2.5',
    displayName: 'Q+2.5',
    series: 'Q+',
    panelWidth: 640,
    panelHeight: 480,
    pixelPitch: 2.5,
    brightness: 1000,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 8.0,
    powerConsumption: 220,
    description: '高解像度屋内用LEDパネル',
    useCase: 'イベント会場、ショッピングモール',
  };

  describe('validatePanelModel', () => {
    it('should validate a correct panel model', () => {
      const result = validatePanelModel(validPanelInput);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject missing required fields', () => {
      const invalidPanel = { ...validPanelInput, modelNumber: '' };
      const result = validatePanelModel(invalidPanel);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Model number is required');
    });

    it('should reject invalid panel width', () => {
      const invalidPanel = { ...validPanelInput, panelWidth: 50 };
      const result = validatePanelModel(invalidPanel);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.includes('Panel width'))).toBe(true);
    });

    it('should reject invalid pixel pitch', () => {
      const invalidPanel = { ...validPanelInput, pixelPitch: 0.1 };
      const result = validatePanelModel(invalidPanel);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.includes('Pixel pitch'))).toBe(true);
    });

    it('should reject invalid brightness', () => {
      const invalidPanel = { ...validPanelInput, brightness: 50 };
      const result = validatePanelModel(invalidPanel);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.includes('Brightness'))).toBe(true);
    });

    it('should validate optional fields when provided', () => {
      const panelWithOptional = {
        ...validPanelInput,
        refreshRate: 3840,
        viewingAngle: 160,
      };
      const result = validatePanelModel(panelWithOptional);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid optional fields', () => {
      const invalidPanel = { ...validPanelInput, refreshRate: 30 };
      const result = validatePanelModel(invalidPanel);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.includes('Refresh rate'))).toBe(true);
    });
  });

  describe('generatePanelId', () => {
    it('should generate ID from panel data', () => {
      const id = generatePanelId(validPanelInput);
      expect(id).toBe('q-plus-p25');
    });

    it('should use provided ID if available', () => {
      const panelWithId = { ...validPanelInput, id: 'custom-id' };
      const id = generatePanelId(panelWithId);
      expect(id).toBe('custom-id');
    });

    it('should handle different series names', () => {
      const panel = { ...validPanelInput, series: 'Pro X', pixelPitch: 1.5 };
      const id = generatePanelId(panel);
      expect(id).toBe('pro-x-p15');
    });

    it('should handle decimal pixel pitch', () => {
      const panel = { ...validPanelInput, pixelPitch: 3.91 };
      const id = generatePanelId(panel);
      expect(id).toBe('q-plus-p391');
    });
  });

  describe('createPanelModel', () => {
    it('should create a valid panel model', () => {
      const panel = createPanelModel(validPanelInput);
      expect(panel.id).toBe('q-plus-p25');
      expect(panel.modelNumber).toBe('Q+2.5');
      expect(panel.brightness).toBe(1000);
    });

    it('should throw error for invalid panel', () => {
      const invalidPanel = { ...validPanelInput, modelNumber: '' };
      expect(() => createPanelModel(invalidPanel)).toThrow('Invalid panel model');
    });

    it('should preserve all fields', () => {
      const panel = createPanelModel(validPanelInput);
      expect(panel.refreshRate).toBe(3840);
      expect(panel.viewingAngle).toBe(160);
      expect(panel.weight).toBe(8.0);
      expect(panel.powerConsumption).toBe(220);
    });
  });

  describe('createPanelModels', () => {
    it('should create multiple valid panels', () => {
      const inputs: LEDPanelModelInput[] = [
        validPanelInput,
        { ...validPanelInput, modelNumber: 'Q+1.5', pixelPitch: 1.5 },
      ];
      const { panels, errors } = createPanelModels(inputs);
      expect(panels).toHaveLength(2);
      expect(errors).toHaveLength(0);
    });

    it('should separate valid and invalid panels', () => {
      const inputs: LEDPanelModelInput[] = [
        validPanelInput,
        { ...validPanelInput, modelNumber: '', pixelPitch: 1.5 },
      ];
      const { panels, errors } = createPanelModels(inputs);
      expect(panels).toHaveLength(1);
      expect(errors).toHaveLength(1);
      expect(errors[0].errors).toContain('Model number is required');
    });

    it('should handle empty input array', () => {
      const { panels, errors } = createPanelModels([]);
      expect(panels).toHaveLength(0);
      expect(errors).toHaveLength(0);
    });
  });

  describe('isValidPanelModel', () => {
    it('should return true for valid panel', () => {
      const panel = createPanelModel(validPanelInput);
      expect(isValidPanelModel(panel)).toBe(true);
    });

    it('should return false for non-object', () => {
      expect(isValidPanelModel(null)).toBe(false);
      expect(isValidPanelModel(undefined)).toBe(false);
      expect(isValidPanelModel('string')).toBe(false);
      expect(isValidPanelModel(123)).toBe(false);
    });

    it('should return false for incomplete object', () => {
      const incomplete = { id: 'test', modelNumber: 'Q+2.5' };
      expect(isValidPanelModel(incomplete)).toBe(false);
    });

    it('should return false for wrong types', () => {
      const wrongTypes = {
        id: 123,
        modelNumber: 'Q+2.5',
        displayName: 'Q+2.5',
        series: 'Q+',
        panelWidth: '640',
        panelHeight: 480,
        pixelPitch: 2.5,
        brightness: 1000,
        description: 'Test',
      };
      expect(isValidPanelModel(wrongTypes)).toBe(false);
    });
  });

  describe('validatePanelModels', () => {
    it('should validate multiple panels', () => {
      const inputs: LEDPanelModelInput[] = [
        validPanelInput,
        { ...validPanelInput, modelNumber: 'Q+1.5', pixelPitch: 1.5 },
      ];
      const results = validatePanelModels(inputs);
      expect(results).toHaveLength(2);
      expect(results[0].validation.isValid).toBe(true);
      expect(results[1].validation.isValid).toBe(true);
    });

    it('should identify invalid panels', () => {
      const inputs: LEDPanelModelInput[] = [
        validPanelInput,
        { ...validPanelInput, brightness: 50 },
      ];
      const results = validatePanelModels(inputs);
      expect(results[0].validation.isValid).toBe(true);
      expect(results[1].validation.isValid).toBe(false);
    });
  });

  describe('parsePanelDataFromJSON', () => {
    it('should parse valid JSON panel data', () => {
      const jsonData = JSON.stringify([validPanelInput]);
      const panels = parsePanelDataFromJSON(jsonData);
      expect(panels).toHaveLength(1);
      expect(panels[0].modelNumber).toBe('Q+2.5');
    });

    it('should throw error for invalid JSON', () => {
      const invalidJSON = '{ invalid json }';
      expect(() => parsePanelDataFromJSON(invalidJSON)).toThrow('Invalid JSON format');
    });

    it('should throw error for non-array JSON', () => {
      const notArray = JSON.stringify({ panel: validPanelInput });
      expect(() => parsePanelDataFromJSON(notArray)).toThrow('must be an array');
    });

    it('should throw error for invalid panel data', () => {
      const invalidData = JSON.stringify([
        { ...validPanelInput, brightness: 50 },
      ]);
      expect(() => parsePanelDataFromJSON(invalidData)).toThrow('Invalid panel data');
    });

    it('should parse multiple valid panels', () => {
      const inputs = [
        validPanelInput,
        { ...validPanelInput, modelNumber: 'Q+1.5', pixelPitch: 1.5 },
      ];
      const jsonData = JSON.stringify(inputs);
      const panels = parsePanelDataFromJSON(jsonData);
      expect(panels).toHaveLength(2);
    });
  });
});
