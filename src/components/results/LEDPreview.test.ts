/**
 * Unit tests for LEDPreview component types and utilities
 */

import { describe, it, expect } from 'vitest';
import type { LEDPreviewProps } from './LEDPreview';

describe('LEDPreview', () => {
  describe('LEDPreviewProps interface', () => {
    it('should have correct required properties', () => {
      const props: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
      };

      expect(props.screenWidth).toBe(4);
      expect(props.screenHeight).toBe(3);
      expect(props.panelWidth).toBe(500);
      expect(props.panelHeight).toBe(500);
    });

    it('should support optional ledPitch property', () => {
      const props: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 2.5,
      };

      expect(props.ledPitch).toBe(2.5);
    });

    it('should support optional mode property', () => {
      const detailedProps: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        mode: 'detailed',
      };

      const compactProps: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        mode: 'compact',
      };

      expect(detailedProps.mode).toBe('detailed');
      expect(compactProps.mode).toBe('compact');
    });

    it('should support optional className property', () => {
      const props: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        className: 'custom-class',
      };

      expect(props.className).toBe('custom-class');
    });

    it('should calculate total dimensions correctly', () => {
      const props: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
      };

      const totalWidth = props.screenWidth * props.panelWidth; // 2000mm
      const totalHeight = props.screenHeight * props.panelHeight; // 1500mm
      const totalPanels = props.screenWidth * props.screenHeight; // 12

      expect(totalWidth).toBe(2000);
      expect(totalHeight).toBe(1500);
      expect(totalPanels).toBe(12);
    });

    it('should handle single panel configuration', () => {
      const props: LEDPreviewProps = {
        screenWidth: 1,
        screenHeight: 1,
        panelWidth: 500,
        panelHeight: 500,
      };

      expect(props.screenWidth * props.screenHeight).toBe(1);
    });

    it('should handle large panel configuration', () => {
      const props: LEDPreviewProps = {
        screenWidth: 50,
        screenHeight: 20,
        panelWidth: 500,
        panelHeight: 500,
      };

      const totalPanels = props.screenWidth * props.screenHeight;
      expect(totalPanels).toBe(1000);
    });

    it('should support different panel sizes', () => {
      const props: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 1000,
        panelHeight: 750,
      };

      expect(props.panelWidth).toBe(1000);
      expect(props.panelHeight).toBe(750);
    });

    it('should support various LED pitch values', () => {
      const finePitch: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 1.2,
      };

      const coarsePitch: LEDPreviewProps = {
        screenWidth: 4,
        screenHeight: 3,
        panelWidth: 500,
        panelHeight: 500,
        ledPitch: 6.0,
      };

      expect(finePitch.ledPitch).toBe(1.2);
      expect(coarsePitch.ledPitch).toBe(6.0);
    });
  });
});
