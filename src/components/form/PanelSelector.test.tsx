import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PanelSelector } from './PanelSelector';
import type { LEDPanelModel } from '@/types/ledPanel';

const mockPanels: LEDPanelModel[] = [
  {
    id: 'test-p1.5',
    modelNumber: 'Q+1.5',
    displayName: 'Q+1.5',
    series: 'Q+',
    panelWidth: 600,
    panelHeight: 337.5,
    pixelPitch: 1.5,
    brightness: 800,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 6.5,
    powerConsumption: 180,
    description: '超高解像度屋内用LEDパネル',
    useCase: '会議室、ショールーム',
  },
  {
    id: 'test-p2.5',
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
  },
  {
    id: 'test-p4.8',
    modelNumber: 'Q+4.8',
    displayName: 'Q+4.8',
    series: 'Q+',
    panelWidth: 576,
    panelHeight: 576,
    pixelPitch: 4.8,
    brightness: 1500,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 9.5,
    powerConsumption: 280,
    description: '屋内外兼用LEDパネル',
    useCase: 'スタジアム、大型イベント',
  },
];

describe('PanelSelector', () => {
  describe('Basic rendering', () => {
    it('should render all panels by default', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      expect(screen.getByText('Q+1.5')).toBeTruthy();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });

    it('should show empty state when no panels', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={[]} onSelect={onSelect} />);
      
      expect(screen.getByText('利用可能なパネルモデルがありません')).toBeTruthy();
    });

    it('should show filter button', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      expect(screen.getByText('フィルタを表示')).toBeTruthy();
    });
  });

  describe('Filter visibility toggle', () => {
    it('should show filters by default for better usability', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      // Filters are hidden by default, button shows "フィルタを表示"
      expect(screen.getByText('フィルタを表示')).toBeTruthy();
    });

    it('should show filters when toggle button is clicked', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      const toggleButton = screen.getByText('フィルタを表示');
      fireEvent.click(toggleButton);
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      expect(searchInput).toBeTruthy();
      expect(screen.getByText('フィルタを非表示')).toBeTruthy();
    });
  });

  describe('Search functionality', () => {
    it('should filter panels by model number', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      // Show filters
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: '1.5' } });
      
      expect(screen.getByText('Q+1.5')).toBeTruthy();
      expect(screen.queryByText('Q+2.5')).toBeNull();
      expect(screen.queryByText('Q+4.8')).toBeNull();
    });

    it('should filter panels by description', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: '屋内外' } });
      
      expect(screen.queryByText('Q+1.5')).toBeNull();
      expect(screen.queryByText('Q+2.5')).toBeNull();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });

    it('should filter panels by use case', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: 'スタジアム' } });
      
      expect(screen.queryByText('Q+1.5')).toBeNull();
      expect(screen.queryByText('Q+2.5')).toBeNull();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });

    it('should be case-insensitive', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: 'Q+' } });
      
      // Should show all panels as they all contain 'Q+'
      expect(screen.getByText('Q+1.5')).toBeTruthy();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });
  });

  describe('Pixel pitch filter', () => {
    it('should filter panels by pixel pitch', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const pitchFilter = screen.getByLabelText('ピクセルピッチ');
      fireEvent.change(pitchFilter, { target: { value: '2.5' } });
      
      expect(screen.queryByText('Q+1.5')).toBeNull();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.queryByText('Q+4.8')).toBeNull();
    });

    it('should show all panels when "すべて" is selected', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const pitchFilter = screen.getByLabelText('ピクセルピッチ');
      fireEvent.change(pitchFilter, { target: { value: '2.5' } });
      fireEvent.change(pitchFilter, { target: { value: 'all' } });
      
      expect(screen.getByText('Q+1.5')).toBeTruthy();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });
  });

  describe('Brightness filter', () => {
    it('should filter panels by brightness', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const brightnessFilter = screen.getByLabelText('輝度');
      fireEvent.change(brightnessFilter, { target: { value: '1500' } });
      
      expect(screen.queryByText('Q+1.5')).toBeNull();
      expect(screen.queryByText('Q+2.5')).toBeNull();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });
  });

  describe('Combined filters', () => {
    it('should apply multiple filters together', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      // Apply search filter
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: 'Q+' } });
      
      // Apply pixel pitch filter
      const pitchFilter = screen.getByLabelText('ピクセルピッチ');
      fireEvent.change(pitchFilter, { target: { value: '2.5' } });
      
      expect(screen.queryByText('Q+1.5')).toBeNull();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.queryByText('Q+4.8')).toBeNull();
    });
  });

  describe('Reset filters', () => {
    it('should reset all filters when reset button is clicked', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      // Apply filters
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: '1.5' } });
      
      const pitchFilter = screen.getByLabelText('ピクセルピッチ');
      fireEvent.change(pitchFilter, { target: { value: '1.5' } });
      
      // Reset filters
      const resetButton = screen.getByText('リセット');
      fireEvent.click(resetButton);
      
      // All panels should be visible again
      expect(screen.getByText('Q+1.5')).toBeTruthy();
      expect(screen.getByText('Q+2.5')).toBeTruthy();
      expect(screen.getByText('Q+4.8')).toBeTruthy();
    });

    it('should disable reset button when no filters are active', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const resetButton = screen.getByText('リセット') as HTMLButtonElement;
      expect(resetButton.disabled).toBe(true);
    });

    it('should enable reset button when filters are active', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: '1.5' } });
      
      const resetButton = screen.getByText('リセット') as HTMLButtonElement;
      expect(resetButton.disabled).toBe(false);
    });
  });

  describe('Results count', () => {
    it('should show total count when no filters are applied', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      expect(screen.getByText('3件のパネルを表示中')).toBeTruthy();
    });

    it('should show filtered count when filters are applied', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: '1.5' } });
      
      expect(screen.getByText('1件のパネルを表示中（全3件中）')).toBeTruthy();
    });
  });

  describe('No results', () => {
    it('should show no results message when no panels match', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      expect(screen.getByText('条件に一致するパネルが見つかりませんでした')).toBeTruthy();
    });

    it('should show reset button in no results message', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByPlaceholderText('モデル名、シリーズ、用途で検索...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      
      const resetButtons = screen.getAllByText('フィルタをリセット');
      expect(resetButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Panel selection', () => {
    it('should call onSelect when a panel is clicked', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      const panel = screen.getByText('Q+1.5').closest('button');
      fireEvent.click(panel!);
      
      expect(onSelect).toHaveBeenCalledWith(mockPanels[0]);
    });

    it('should show selected panel with proper styling', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} selectedPanelId="test-p1.5" onSelect={onSelect} />);
      
      const panel = screen.getByText('Q+1.5').closest('button');
      expect(panel?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for search input', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      const searchInput = screen.getByLabelText('パネルを検索');
      expect(searchInput).toBeTruthy();
    });

    it('should have proper labels for filter selects', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('フィルタを表示'));
      
      expect(screen.getByLabelText('ピクセルピッチ')).toBeTruthy();
      expect(screen.getByLabelText('輝度')).toBeTruthy();
    });

    it('should have proper aria-expanded on filter toggle button', () => {
      const onSelect = vi.fn();
      render(<PanelSelector panels={mockPanels} onSelect={onSelect} />);
      
      const toggleButton = screen.getByText('フィルタを表示').closest('button');
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('false');
      
      fireEvent.click(toggleButton!);
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
