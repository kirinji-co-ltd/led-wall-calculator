import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PanelDetail } from './PanelDetail';
import type { LEDPanelModel } from '@/types/ledPanel';

describe('PanelDetail', () => {
  const mockPanel: LEDPanelModel = {
    id: 'test-panel',
    modelNumber: 'TEST-1',
    displayName: 'Test Panel',
    series: 'Test Series',
    panelWidth: 600,
    panelHeight: 400,
    pixelPitch: 2.5,
    brightness: 1000,
    refreshRate: 3840,
    viewingAngle: 160,
    weight: 8.5,
    powerConsumption: 220,
    description: 'Test panel description',
    useCase: 'Test use case',
  };

  it('should render panel display name', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('Test Panel')).toBeInTheDocument();
  });

  it('should render panel series and model number', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText(/Test Seriesシリーズ - TEST-1/)).toBeInTheDocument();
  });

  it('should render pixel pitch badge', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('P2.5')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('Test panel description')).toBeInTheDocument();
  });

  it('should render panel size', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('600 × 400 mm')).toBeInTheDocument();
  });

  it('should render pixel pitch specification', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('ピクセルピッチ')).toBeInTheDocument();
    expect(screen.getByText('2.5 mm')).toBeInTheDocument();
  });

  it('should render brightness', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('輝度')).toBeInTheDocument();
    expect(screen.getByText('1000 nits')).toBeInTheDocument();
  });

  it('should render weight when provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('重量')).toBeInTheDocument();
    expect(screen.getByText('8.5 kg')).toBeInTheDocument();
  });

  it('should render power consumption when provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('消費電力')).toBeInTheDocument();
    expect(screen.getByText('220 W')).toBeInTheDocument();
  });

  it('should render refresh rate when provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('リフレッシュレート')).toBeInTheDocument();
    expect(screen.getByText('3840 Hz')).toBeInTheDocument();
  });

  it('should render viewing angle when provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('視野角')).toBeInTheDocument();
    expect(screen.getByText('160°')).toBeInTheDocument();
  });

  it('should render use case when provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.getByText('推奨用途')).toBeInTheDocument();
    expect(screen.getByText('Test use case')).toBeInTheDocument();
  });

  it('should render price when provided', () => {
    const panelWithPrice: LEDPanelModel = {
      ...mockPanel,
      pricePerPanel: 125000,
    };
    
    render(<PanelDetail panel={panelWithPrice} />);
    
    expect(screen.getByText('価格（1枚あたり）')).toBeInTheDocument();
    expect(screen.getByText('¥125,000')).toBeInTheDocument();
  });

  it('should render image when imageUrl is provided', () => {
    const panelWithImage: LEDPanelModel = {
      ...mockPanel,
      imageUrl: 'https://example.com/panel.jpg',
    };
    
    render(<PanelDetail panel={panelWithImage} />);
    
    const image = screen.getByAltText('Test Panelのイメージ');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/panel.jpg');
  });

  it('should not render image when imageUrl is not provided', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should not render optional specs when not provided', () => {
    const minimalPanel: LEDPanelModel = {
      id: 'minimal',
      modelNumber: 'MIN-1',
      displayName: 'Minimal',
      series: 'Basic',
      panelWidth: 500,
      panelHeight: 500,
      pixelPitch: 2.0,
      brightness: 800,
      description: 'Minimal panel',
    };
    
    render(<PanelDetail panel={minimalPanel} />);
    
    expect(screen.queryByText('重量')).not.toBeInTheDocument();
    expect(screen.queryByText('消費電力')).not.toBeInTheDocument();
    expect(screen.queryByText('リフレッシュレート')).not.toBeInTheDocument();
    expect(screen.queryByText('視野角')).not.toBeInTheDocument();
    expect(screen.queryByText('推奨用途')).not.toBeInTheDocument();
    expect(screen.queryByText('価格')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PanelDetail panel={mockPanel} className="custom-class" />);
    
    const article = container.querySelector('div[role="article"]');
    expect(article).toHaveClass('custom-class');
  });

  it('should have proper ARIA label', () => {
    render(<PanelDetail panel={mockPanel} />);
    
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', 'Test Panelの詳細情報');
  });

  it('should be accessible', async () => {
    const { container } = render(<PanelDetail panel={mockPanel} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should be accessible with all optional fields', async () => {
    const fullPanel: LEDPanelModel = {
      ...mockPanel,
      imageUrl: 'https://example.com/panel.jpg',
      pricePerPanel: 125000,
    };
    
    const { container } = render(<PanelDetail panel={fullPanel} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should format large numbers with commas', () => {
    const expensivePanel: LEDPanelModel = {
      ...mockPanel,
      pricePerPanel: 1250000,
    };
    
    render(<PanelDetail panel={expensivePanel} />);
    
    expect(screen.getByText('¥1,250,000')).toBeInTheDocument();
  });
});
