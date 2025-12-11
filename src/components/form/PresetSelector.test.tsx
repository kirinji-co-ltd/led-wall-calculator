import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { PresetSelector } from './PresetSelector';
import { getAllPresets } from '@/lib/presetStorage';

vi.mock('@/lib/presetStorage', () => ({
  getAllPresets: vi.fn(),
}));

describe('PresetSelector', () => {
  const mockPresets = [
    {
      id: 'preset-1',
      name: 'Small Screen',
      description: 'For small displays',
      category: 'panel-size' as const,
      panelWidth: 500,
      panelHeight: 500,
      ledPitch: 2.5,
      isCustom: false,
    },
    {
      id: 'preset-2',
      name: 'Large Screen',
      description: 'For large displays',
      category: 'panel-size' as const,
      panelWidth: 1000,
      panelHeight: 1000,
      ledPitch: 5,
      isCustom: false,
    },
  ];

  beforeEach(() => {
    vi.mocked(getAllPresets).mockReturnValue(mockPresets);
  });

  it('should render with label', () => {
    render(<PresetSelector onSelect={vi.fn()} />);
    
    expect(screen.getByText('プリセットから選択')).toBeInTheDocument();
  });

  it('should show placeholder text when no preset is selected', () => {
    render(<PresetSelector onSelect={vi.fn()} />);
    
    expect(screen.getByText('プリセットを選択')).toBeInTheDocument();
  });

  it('should show selected preset name when selectedId is provided', () => {
    render(<PresetSelector onSelect={vi.fn()} selectedId="preset-1" />);
    
    expect(screen.getByText('Small Screen')).toBeInTheDocument();
    expect(screen.getByText('For small displays')).toBeInTheDocument();
  });

  it('should open dropdown when button is clicked', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button', { name: /プリセットから選択/i });
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should display all presets in dropdown', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Small Screen')).toBeInTheDocument();
    expect(screen.getByText('Large Screen')).toBeInTheDocument();
  });

  it('should call onSelect when a preset is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PresetSelector onSelect={onSelect} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const preset = screen.getByText('Small Screen');
    await user.click(preset);
    
    expect(onSelect).toHaveBeenCalledWith(mockPresets[0]);
  });

  it('should close dropdown after selecting a preset', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const preset = screen.getByText('Small Screen');
    await user.click(preset);
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should close dropdown when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click backdrop (the fixed overlay)
    const backdrop = screen.getByRole('listbox').previousElementSibling;
    await user.click(backdrop as Element);
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should close dropdown when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should navigate presets with ArrowDown key', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await user.keyboard('{ArrowDown}');
    
    // First item should be focused
    const listbox = screen.getByRole('listbox');
    const firstOption = within(listbox).getAllByRole('option')[0];
    expect(firstOption).toHaveClass('bg-zinc-200');
  });

  it('should navigate presets with ArrowUp key', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await user.keyboard('{ArrowUp}');
    
    // Last item should be focused (wraps around)
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    const lastOption = options[options.length - 1];
    expect(lastOption).toHaveClass('bg-zinc-200');
  });

  it('should select preset with Enter key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PresetSelector onSelect={onSelect} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    expect(onSelect).toHaveBeenCalledWith(mockPresets[0]);
  });

  it('should select preset with Space key', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PresetSelector onSelect={onSelect} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');
    
    expect(onSelect).toHaveBeenCalledWith(mockPresets[0]);
  });

  it('should have proper ARIA attributes', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    
    await user.click(button);
    
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should mark selected option with aria-selected', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} selectedId="preset-1" />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('should be accessible', async () => {
    const { container } = render(<PresetSelector onSelect={vi.fn()} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should be accessible when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should show custom badge for custom presets', async () => {
    const customPresets = [
      {
        ...mockPresets[0],
        isCustom: true,
      },
    ];
    vi.mocked(getAllPresets).mockReturnValue(customPresets);
    
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('カスタム')).toBeInTheDocument();
  });

  it('should display preset specifications', async () => {
    const user = userEvent.setup();
    render(<PresetSelector onSelect={vi.fn()} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText(/500×500mm, P2.5/)).toBeInTheDocument();
    expect(screen.getByText(/1000×1000mm, P5/)).toBeInTheDocument();
  });
});
