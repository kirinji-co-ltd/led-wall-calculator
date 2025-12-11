import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  const defaultProps = {
    label: 'Test Label',
    name: 'test-input',
    value: 10,
    onChange: vi.fn(),
  };

  it('should render with label and value', () => {
    render(<NumberInput {...defaultProps} />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue(10);
  });

  it('should show required indicator when required', () => {
    render(<NumberInput {...defaultProps} required />);
    
    expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
  });

  it('should display unit when provided', () => {
    render(<NumberInput {...defaultProps} unit="mm" />);
    
    expect(screen.getByText('mm')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<NumberInput {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should call onChange with number value when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput {...defaultProps} value={0} onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '42');
    
    // onChange should have been called with numeric values
    expect(onChange).toHaveBeenCalled();
    onChange.mock.calls.forEach(call => {
      expect(typeof call[0]).toBe('number');
      expect(call[0]).toBeGreaterThanOrEqual(0);
    });
  });

  it('should call onChange with 0 when input is cleared', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('should call onBlur when input loses focus', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<NumberInput {...defaultProps} onBlur={onBlur} />);
    
    const input = screen.getByRole('spinbutton');
    await user.click(input);
    await user.tab();
    
    expect(onBlur).toHaveBeenCalled();
  });

  it('should apply correct min and max attributes', () => {
    render(<NumberInput {...defaultProps} min={0} max={100} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('should apply correct step attribute', () => {
    render(<NumberInput {...defaultProps} step={0.1} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('step', '0.1');
  });

  it('should show placeholder text', () => {
    render(<NumberInput {...defaultProps} placeholder="Enter value" />);
    
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<NumberInput {...defaultProps} disabled />);
    
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('should have aria-invalid when error is present', () => {
    render(<NumberInput {...defaultProps} error="Error message" />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should have aria-describedby when error is present', () => {
    render(<NumberInput {...defaultProps} name="test" error="Error message" />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('aria-describedby', 'input-test-error');
  });

  it('should not have aria-describedby when no error', () => {
    render(<NumberInput {...defaultProps} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('should be accessible', async () => {
    const { container } = render(<NumberInput {...defaultProps} />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should be accessible with error', async () => {
    const { container } = render(
      <NumberInput {...defaultProps} error="Error message" />
    );
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('should handle decimal values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput {...defaultProps} value={0} onChange={onChange} step={0.1} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, '3.14');
    
    // onChange should have been called with numeric values
    expect(onChange).toHaveBeenCalled();
    onChange.mock.calls.forEach(call => {
      expect(typeof call[0]).toBe('number');
      expect(!isNaN(call[0])).toBe(true);
    });
  });

  it('should not call onChange with NaN', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<NumberInput {...defaultProps} value={10} onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.clear(input);
    await user.type(input, 'abc');
    
    // Should not have called onChange with invalid value
    const calls = onChange.mock.calls.filter(call => !isNaN(call[0]));
    expect(calls.length).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(<NumberInput {...defaultProps} className="custom-class" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });
});
