import { describe, it, expect } from 'vitest';
import { panelModels, getPanelModelById, getPanelModelsBySeries, getAvailableSeries } from './panelModels';

describe('Panel Models', () => {
  describe('panelModels', () => {
    it('should have Q+ series panels', () => {
      expect(panelModels.length).toBeGreaterThan(0);
      expect(panelModels.every(panel => panel.series === 'Q+')).toBe(true);
    });

    it('should have required properties', () => {
      panelModels.forEach(panel => {
        expect(panel.id).toBeTruthy();
        expect(panel.modelNumber).toBeTruthy();
        expect(panel.displayName).toBeTruthy();
        expect(panel.series).toBeTruthy();
        expect(panel.panelWidth).toBeGreaterThan(0);
        expect(panel.panelHeight).toBeGreaterThan(0);
        expect(panel.pixelPitch).toBeGreaterThan(0);
        expect(panel.brightness).toBeGreaterThan(0);
        expect(panel.description).toBeTruthy();
      });
    });

    it('should have unique IDs', () => {
      const ids = panelModels.map(panel => panel.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getPanelModelById', () => {
    it('should return panel by ID', () => {
      const panel = getPanelModelById('q-plus-p2.5');
      expect(panel).toBeDefined();
      expect(panel?.id).toBe('q-plus-p2.5');
      expect(panel?.modelNumber).toBe('Q+2.5');
    });

    it('should return undefined for non-existent ID', () => {
      const panel = getPanelModelById('non-existent-id');
      expect(panel).toBeUndefined();
    });
  });

  describe('getPanelModelsBySeries', () => {
    it('should return all Q+ series panels', () => {
      const qPlusPanels = getPanelModelsBySeries('Q+');
      expect(qPlusPanels.length).toBe(panelModels.length);
      expect(qPlusPanels.every(panel => panel.series === 'Q+')).toBe(true);
    });

    it('should return empty array for non-existent series', () => {
      const panels = getPanelModelsBySeries('NonExistent');
      expect(panels).toEqual([]);
    });
  });

  describe('getAvailableSeries', () => {
    it('should return available series', () => {
      const series = getAvailableSeries();
      expect(series).toContain('Q+');
      expect(series.length).toBeGreaterThan(0);
    });

    it('should return unique series', () => {
      const series = getAvailableSeries();
      const uniqueSeries = new Set(series);
      expect(uniqueSeries.size).toBe(series.length);
    });
  });
});
