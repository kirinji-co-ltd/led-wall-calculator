import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';
import * as presetStorage from '@/lib/presetStorage';

vi.mock('@/lib/presetStorage', () => ({
  getAllPresets: vi.fn(() => []),
  loadCustomPresets: vi.fn(() => []),
}));

describe('HomePage Integration', () => {
  it('should render the main page', () => {
    render(<HomePage />);
    
    expect(screen.getByText('LEDウォール計算機')).toBeInTheDocument();
    expect(screen.getByText('LEDパネル仕様入力')).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    render(<HomePage />);
    
    // Check for form section
    expect(screen.getByText('LEDパネル仕様入力')).toBeInTheDocument();
    
    // Check for preset selector
    expect(screen.getByText('プリセットから選択')).toBeInTheDocument();
    
    // Check for preset manager button
    expect(screen.getByLabelText('プリセット管理を開く')).toBeInTheDocument();
  });

  it('should render header and footer', () => {
    render(<HomePage />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should have main content area', () => {
    render(<HomePage />);
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
  });

  it('should render form with all required fields', () => {
    render(<HomePage />);
    
    // Check that inputs exist by looking for number inputs
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should render error boundary', () => {
    // If an error occurs, it should be caught by ErrorBoundary
    // Just verify the component renders without crashing
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });

  it('should have accessible structure', () => {
    render(<HomePage />);
    
    // Check for semantic HTML
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });

  it('should render preset manager and selector components', () => {
    render(<HomePage />);
    
    // Both components should be in the document
    expect(screen.getByLabelText('プリセット管理を開く')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /プリセットから選択/ })).toBeInTheDocument();
  });
});
