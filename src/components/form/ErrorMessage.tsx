'use client';

export interface ErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Error message component for form validation
 */
export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <p
      className={`text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </p>
  );
};
