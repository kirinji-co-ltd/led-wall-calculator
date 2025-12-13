/**
 * Unit tests for LED Wall Calculation Engine
 */

import { describe, it, expect } from 'vitest';
import {
  calculatePanelCount,
  calculateResolution,
  calculatePhysicalSize,
  calculatePixelDensity,
  calculateViewingDistance,
  calculateCostEstimate,
  calculateLEDWall,
  validateInput,
  unitConversion,
} from './calculations';
import { CalculationError } from '@/types/led-calculator';
import type { LEDWallInput, Resolution, PhysicalSize } from '@/types/led-calculator';

describe('LED Wall Calculations', () => {
  describe('validateInput', () => {
    it('should pass validation for valid input', () => {
      const validInput: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => validateInput(validInput)).not.toThrow();
    });

    it('should throw error for zero panel width', () => {
      const input: LEDWallInput = {
        panelWidth: 0,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
      expect(() => validateInput(input)).toThrow('パネルサイズは0より大きい値である必要があります');
    });

    it('should throw error for negative panel height', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: -100,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
    });

    it('should throw error for zero screen width', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 0,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
    });

    it('should throw error for non-integer screen width', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4.5,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
      expect(() => validateInput(input)).toThrow('画面サイズ（枚数）は整数である必要があります');
    });

    it('should throw error for zero LED pitch', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 0,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
      expect(() => validateInput(input)).toThrow('LEDピッチは0より大きい値である必要があります');
    });

    it('should throw error for negative price per panel', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
        pricePerPanel: -1000,
      };

      expect(() => validateInput(input)).toThrow(CalculationError);
      expect(() => validateInput(input)).toThrow('パネル価格は0以上である必要があります');
    });
  });

  describe('calculatePanelCount', () => {
    it('should calculate panel count correctly', () => {
      expect(calculatePanelCount(4, 3)).toBe(12);
      expect(calculatePanelCount(2, 2)).toBe(4);
      expect(calculatePanelCount(5, 6)).toBe(30);
      expect(calculatePanelCount(1, 1)).toBe(1);
    });
  });

  describe('calculateResolution', () => {
    it('should calculate resolution correctly for 500mm panels with 2.5mm pitch', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      const result = calculateResolution(input);

      // 500 / 2.5 = 200 pixels per panel
      // 200 * 4 = 800 width
      // 200 * 3 = 600 height
      expect(result.width).toBe(800);
      expect(result.height).toBe(600);
      expect(result.totalPixels).toBe(480000);
    });

    it('should calculate resolution correctly for different panel sizes', () => {
      const input: LEDWallInput = {
        panelWidth: 1000,
        panelHeight: 500,
        screenWidth: 2,
        screenHeight: 4,
        ledPitch: 5,
      };

      const result = calculateResolution(input);

      // 1000 / 5 = 200 pixels per panel width
      // 500 / 5 = 100 pixels per panel height
      // 200 * 2 = 400 width
      // 100 * 4 = 400 height
      expect(result.width).toBe(400);
      expect(result.height).toBe(400);
      expect(result.totalPixels).toBe(160000);
    });

    it('should floor pixel counts when division is not exact', () => {
      const input: LEDWallInput = {
        panelWidth: 503,
        panelHeight: 503,
        screenWidth: 1,
        screenHeight: 1,
        ledPitch: 2.5,
      };

      const result = calculateResolution(input);

      // 503 / 2.5 = 201.2, floored to 201
      expect(result.width).toBe(201);
      expect(result.height).toBe(201);
      expect(result.totalPixels).toBe(40401);
    });
  });

  describe('calculatePhysicalSize', () => {
    it('should calculate physical size correctly', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      const result = calculatePhysicalSize(input);

      expect(result.width).toBe(2000); // 500 * 4
      expect(result.height).toBe(1500); // 500 * 3
      expect(result.area).toBe(3); // 2000 * 1500 / 1,000,000 = 3 m²
    });

    it('should calculate area in square meters correctly', () => {
      const input: LEDWallInput = {
        panelWidth: 1000,
        panelHeight: 1000,
        screenWidth: 2,
        screenHeight: 2,
        ledPitch: 5,
      };

      const result = calculatePhysicalSize(input);

      expect(result.width).toBe(2000);
      expect(result.height).toBe(2000);
      expect(result.area).toBe(4); // 2m * 2m = 4 m²
    });
  });

  describe('calculatePixelDensity', () => {
    it('should calculate pixel density correctly', () => {
      const resolution: Resolution = {
        width: 800,
        height: 600,
        totalPixels: 480000,
      };

      const physicalSize: PhysicalSize = {
        width: 2000,
        height: 1500,
        area: 3,
      };

      const density = calculatePixelDensity(resolution, physicalSize);

      expect(density).toBe(160000); // 480000 / 3 = 160000 pixels/m²
    });

    it('should throw error for zero area', () => {
      const resolution: Resolution = {
        width: 800,
        height: 600,
        totalPixels: 480000,
      };

      const physicalSize: PhysicalSize = {
        width: 0,
        height: 0,
        area: 0,
      };

      expect(() => calculatePixelDensity(resolution, physicalSize)).toThrow(CalculationError);
      expect(() => calculatePixelDensity(resolution, physicalSize)).toThrow(
        '面積が0のためピクセル密度を計算できません'
      );
    });
  });

  describe('calculateViewingDistance', () => {
    it('should calculate viewing distances correctly', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      const physicalSize: PhysicalSize = {
        width: 2000,
        height: 1500,
        area: 3,
      };

      const result = calculateViewingDistance(input, physicalSize);

      // minimum = 2.5 * 1000 / 1000 = 2.5m
      expect(result.minimum).toBe(2.5);

      // optimal = 2000 (max dimension) * 3.5 / 1000 = 7m
      expect(result.optimal).toBe(7);

      // maximum = 2000 * 10 / 1000 = 20m
      expect(result.maximum).toBe(20);
    });

    it('should use height as max dimension when height > width', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 2,
        screenHeight: 5,
        ledPitch: 3,
      };

      const physicalSize: PhysicalSize = {
        width: 1000,
        height: 2500,
        area: 2.5,
      };

      const result = calculateViewingDistance(input, physicalSize);

      // minimum = 3 * 1000 / 1000 = 3m
      expect(result.minimum).toBe(3);

      // optimal = 2500 (max dimension) * 3.5 / 1000 = 8.75m, rounded to 8.8
      expect(result.optimal).toBe(8.8);

      // maximum = 2500 * 10 / 1000 = 25m
      expect(result.maximum).toBe(25);
    });
  });

  describe('calculateCostEstimate', () => {
    it('should calculate cost estimate correctly', () => {
      const result = calculateCostEstimate(12, 100000, 3);

      expect(result.panelCount).toBe(12);
      expect(result.totalCost).toBe(1200000); // 12 * 100000
      expect(result.costPerSquareMeter).toBe(400000); // 1200000 / 3
    });

    it('should round costs to nearest integer', () => {
      const result = calculateCostEstimate(10, 99999, 3.5);

      expect(result.totalCost).toBe(999990); // 10 * 99999, rounded
      expect(result.costPerSquareMeter).toBe(285711); // 999990 / 3.5, rounded
    });

    it('should throw error for zero area', () => {
      expect(() => calculateCostEstimate(10, 100000, 0)).toThrow(CalculationError);
      expect(() => calculateCostEstimate(10, 100000, 0)).toThrow(
        '面積が0のため平方メートルあたりの費用を計算できません'
      );
    });
  });

  describe('calculateLEDWall', () => {
    it('should calculate all values correctly for valid input', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
        pricePerPanel: 100000,
      };

      const result = calculateLEDWall(input);

      expect(result.input).toEqual(input);
      expect(result.panelCount).toBe(12);
      expect(result.resolution).toEqual({
        width: 800,
        height: 600,
        totalPixels: 480000,
      });
      expect(result.physicalSize).toEqual({
        width: 2000,
        height: 1500,
        area: 3,
      });
      expect(result.pixelDensity).toBe(160000);
      expect(result.viewingDistance).toEqual({
        minimum: 2.5,
        optimal: 7,
        maximum: 20,
      });
      expect(result.costEstimate).toEqual({
        panelCount: 12,
        totalCost: 1200000,
        costPerSquareMeter: 400000,
      });
    });

    it('should not include cost estimate when pricePerPanel is not provided', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      const result = calculateLEDWall(input);

      expect(result.costEstimate).toBeUndefined();
    });

    it('should throw error for invalid input', () => {
      const input: LEDWallInput = {
        panelWidth: 0,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 2.5,
      };

      expect(() => calculateLEDWall(input)).toThrow(CalculationError);
    });

    it('should handle large screen configurations', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 10,
        screenHeight: 10,
        ledPitch: 1.5,
      };

      const result = calculateLEDWall(input);

      expect(result.panelCount).toBe(100);
      expect(result.resolution.width).toBe(3330); // floor(500/1.5) * 10
      expect(result.resolution.height).toBe(3330);
      expect(result.physicalSize.width).toBe(5000);
      expect(result.physicalSize.height).toBe(5000);
      expect(result.physicalSize.area).toBe(25); // 5m * 5m
    });

    it('should handle small screen configurations', () => {
      const input: LEDWallInput = {
        panelWidth: 250,
        panelHeight: 250,
        screenWidth: 1,
        screenHeight: 1,
        ledPitch: 5,
      };

      const result = calculateLEDWall(input);

      expect(result.panelCount).toBe(1);
      expect(result.resolution.width).toBe(50); // 250/5 = 50
      expect(result.resolution.height).toBe(50);
      expect(result.physicalSize.width).toBe(250);
      expect(result.physicalSize.height).toBe(250);
      expect(result.physicalSize.area).toBe(0.0625); // 0.25m * 0.25m
    });

    it('should include panel model information when panel ID is provided', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 3.91,
        selectedPanelId: 'q-plus-p3.9',
      };

      const result = calculateLEDWall(input);

      expect(result.panelModel).toBeDefined();
      expect(result.panelModel?.id).toBe('q-plus-p3.9');
      expect(result.panelModel?.modelNumber).toBe('Q+3.9');
      expect(result.panelModel?.displayName).toBe('Q+3.9');
      expect(result.panelModel?.series).toBe('Q+');
      expect(result.panelModel?.brightness).toBe(1200);
      expect(result.panelModel?.refreshRate).toBe(3840);
      expect(result.panelModel?.viewingAngle).toBe(160);
    });

    it('should not include panel model information when panel ID is not provided', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 3.91,
      };

      const result = calculateLEDWall(input);

      expect(result.panelModel).toBeUndefined();
    });

    it('should not include panel model information when panel ID is invalid', () => {
      const input: LEDWallInput = {
        panelWidth: 500,
        panelHeight: 500,
        screenWidth: 4,
        screenHeight: 3,
        ledPitch: 3.91,
        selectedPanelId: 'non-existent-panel',
      };

      const result = calculateLEDWall(input);

      expect(result.panelModel).toBeUndefined();
    });
  });

  describe('unitConversion', () => {
    describe('mmToM', () => {
      it('should convert millimeters to meters', () => {
        expect(unitConversion.mmToM(1000)).toBe(1);
        expect(unitConversion.mmToM(2500)).toBe(2.5);
        expect(unitConversion.mmToM(500)).toBe(0.5);
        expect(unitConversion.mmToM(0)).toBe(0);
      });
    });

    describe('mToMm', () => {
      it('should convert meters to millimeters', () => {
        expect(unitConversion.mToMm(1)).toBe(1000);
        expect(unitConversion.mToMm(2.5)).toBe(2500);
        expect(unitConversion.mToMm(0.5)).toBe(500);
        expect(unitConversion.mToMm(0)).toBe(0);
      });
    });

    describe('mm2ToM2', () => {
      it('should convert square millimeters to square meters', () => {
        expect(unitConversion.mm2ToM2(1_000_000)).toBe(1);
        expect(unitConversion.mm2ToM2(2_500_000)).toBe(2.5);
        expect(unitConversion.mm2ToM2(500_000)).toBe(0.5);
        expect(unitConversion.mm2ToM2(0)).toBe(0);
      });
    });

    describe('m2ToMm2', () => {
      it('should convert square meters to square millimeters', () => {
        expect(unitConversion.m2ToMm2(1)).toBe(1_000_000);
        expect(unitConversion.m2ToMm2(2.5)).toBe(2_500_000);
        expect(unitConversion.m2ToMm2(0.5)).toBe(500_000);
        expect(unitConversion.m2ToMm2(0)).toBe(0);
      });
    });

    it('should have inverse relationships', () => {
      const mm = 2500;
      expect(unitConversion.mToMm(unitConversion.mmToM(mm))).toBe(mm);

      const m = 2.5;
      expect(unitConversion.mmToM(unitConversion.mToMm(m))).toBe(m);

      const mm2 = 2_500_000;
      expect(unitConversion.m2ToMm2(unitConversion.mm2ToM2(mm2))).toBe(mm2);

      const m2 = 2.5;
      expect(unitConversion.mm2ToM2(unitConversion.m2ToMm2(m2))).toBe(m2);
    });
  });
});
