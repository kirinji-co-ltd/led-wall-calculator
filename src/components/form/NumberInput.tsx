'use client';

import { ChangeEvent, FocusEvent } from 'react';
import { ErrorMessage } from './ErrorMessage';

export interface NumberInputProps {
  /** Input label */
  label: string;
  /** Input name/id */
  name: string;
  /** Current value */
  value: number | string;
  /** Change handler */
  onChange: (value: number) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Unit to display (e.g., "mm", "m", "円") */
  unit?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Number input component with validation and unit display
 */
export const NumberInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  min = 0,
  max,
  step = 1,
  unit,
  required = false,
  error,
  placeholder,
  className = '',
  disabled = false,
}: NumberInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string for clearing the field
    if (newValue === '') {
      onChange(0);
      return;
    }
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur();
    }
  };

  const inputId = `input-${name}`;
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-zinc-900 dark:text-zinc-100"
      >
        {label}
        {required && <span className="text-red-600 dark:text-red-400 ml-1" aria-label="required">*</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          id={inputId}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          className={`
            w-full px-4 py-2 rounded-lg border transition-colors
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500'
            }
            bg-white dark:bg-zinc-900
            text-zinc-900 dark:text-zinc-100
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${unit ? 'pr-12' : ''}
          `}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500 dark:text-zinc-400">
            {unit}
          </span>
        )}
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};
