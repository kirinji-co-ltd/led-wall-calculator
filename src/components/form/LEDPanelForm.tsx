'use client';

import { useState, useCallback } from 'react';
import { NumberInput } from './NumberInput';
import type { LEDPanelFormData, FieldValidationResult } from '@/types/ledPanel';

export interface LEDPanelFormProps {
  /** Initial form values */
  initialValues?: Partial<LEDPanelFormData>;
  /** Form submission handler */
  onSubmit?: (data: LEDPanelFormData) => void;
  /** Form change handler (real-time updates) */
  onChange?: (data: LEDPanelFormData) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LED Panel specification input form with validation
 */
export const LEDPanelForm = ({
  initialValues = {},
  onSubmit,
  onChange,
  className = '',
}: LEDPanelFormProps) => {
  const [formData, setFormData] = useState<LEDPanelFormData>({
    panelWidth: initialValues.panelWidth || 0,
    panelHeight: initialValues.panelHeight || 0,
    screenWidth: initialValues.screenWidth || 0,
    screenHeight: initialValues.screenHeight || 0,
    ledPitch: initialValues.ledPitch || 0,
    viewingDistance: initialValues.viewingDistance || 0,
    budget: initialValues.budget || 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LEDPanelFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LEDPanelFormData, boolean>>>({});

  // Validation functions
  const validateField = useCallback((field: keyof LEDPanelFormData, value: number): FieldValidationResult => {
    switch (field) {
      case 'panelWidth':
      case 'panelHeight':
        if (value <= 0) {
          return { isValid: false, error: 'パネルサイズは0より大きい値を入力してください' };
        }
        if (value > 10000) {
          return { isValid: false, error: 'パネルサイズは10,000mm以下で入力してください' };
        }
        break;
      case 'screenWidth':
      case 'screenHeight':
        if (value <= 0) {
          return { isValid: false, error: '画面サイズは0より大きい値を入力してください' };
        }
        if (value > 100) {
          return { isValid: false, error: '画面サイズは100枚以下で入力してください' };
        }
        if (!Number.isInteger(value)) {
          return { isValid: false, error: '画面サイズは整数で入力してください' };
        }
        break;
      case 'ledPitch':
        if (value <= 0) {
          return { isValid: false, error: 'LEDピッチは0より大きい値を入力してください' };
        }
        if (value > 100) {
          return { isValid: false, error: 'LEDピッチは100mm以下で入力してください' };
        }
        break;
      case 'viewingDistance':
        if (value <= 0) {
          return { isValid: false, error: '視聴距離は0より大きい値を入力してください' };
        }
        if (value > 1000) {
          return { isValid: false, error: '視聴距離は1,000m以下で入力してください' };
        }
        break;
      case 'budget':
        if (value < 0) {
          return { isValid: false, error: '予算は0以上で入力してください' };
        }
        break;
    }
    return { isValid: true };
  }, []);

  const handleFieldChange = useCallback((field: keyof LEDPanelFormData, value: number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Validate field if touched
    if (touched[field]) {
      const validation = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: validation.error,
      }));
    }

    // Call onChange callback
    if (onChange) {
      onChange(newFormData);
    }
  }, [formData, touched, validateField, onChange]);

  const handleFieldBlur = useCallback((field: keyof LEDPanelFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validation = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: validation.error,
    }));
  }, [formData, validateField]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof LEDPanelFormData, string>> = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof LEDPanelFormData>).forEach(field => {
      const validation = validateField(field, formData[field]);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched({
      panelWidth: true,
      panelHeight: true,
      screenWidth: true,
      screenHeight: true,
      ledPitch: true,
      viewingDistance: true,
      budget: true,
    });

    if (!hasErrors && onSubmit) {
      onSubmit(formData);
    }
  }, [formData, validateField, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberInput
          label="LEDパネル幅"
          name="panelWidth"
          value={formData.panelWidth}
          onChange={(value) => handleFieldChange('panelWidth', value)}
          onBlur={() => handleFieldBlur('panelWidth')}
          unit="mm"
          required
          error={touched.panelWidth ? errors.panelWidth : undefined}
          placeholder="例: 500"
          min={0}
          max={10000}
          step={0.1}
        />
        <NumberInput
          label="LEDパネル高さ"
          name="panelHeight"
          value={formData.panelHeight}
          onChange={(value) => handleFieldChange('panelHeight', value)}
          onBlur={() => handleFieldBlur('panelHeight')}
          unit="mm"
          required
          error={touched.panelHeight ? errors.panelHeight : undefined}
          placeholder="例: 500"
          min={0}
          max={10000}
          step={0.1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberInput
          label="画面幅（枚数）"
          name="screenWidth"
          value={formData.screenWidth}
          onChange={(value) => handleFieldChange('screenWidth', value)}
          onBlur={() => handleFieldBlur('screenWidth')}
          unit="枚"
          required
          error={touched.screenWidth ? errors.screenWidth : undefined}
          placeholder="例: 4"
          min={1}
          max={100}
          step={1}
        />
        <NumberInput
          label="画面高さ（枚数）"
          name="screenHeight"
          value={formData.screenHeight}
          onChange={(value) => handleFieldChange('screenHeight', value)}
          onBlur={() => handleFieldBlur('screenHeight')}
          unit="枚"
          required
          error={touched.screenHeight ? errors.screenHeight : undefined}
          placeholder="例: 3"
          min={1}
          max={100}
          step={1}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NumberInput
          label="LEDピッチ"
          name="ledPitch"
          value={formData.ledPitch}
          onChange={(value) => handleFieldChange('ledPitch', value)}
          onBlur={() => handleFieldBlur('ledPitch')}
          unit="mm"
          required
          error={touched.ledPitch ? errors.ledPitch : undefined}
          placeholder="例: 2.5"
          min={0}
          max={100}
          step={0.1}
        />
        <NumberInput
          label="視聴距離"
          name="viewingDistance"
          value={formData.viewingDistance}
          onChange={(value) => handleFieldChange('viewingDistance', value)}
          onBlur={() => handleFieldBlur('viewingDistance')}
          unit="m"
          required
          error={touched.viewingDistance ? errors.viewingDistance : undefined}
          placeholder="例: 5"
          min={0}
          max={1000}
          step={0.1}
        />
      </div>

      <NumberInput
        label="予算範囲"
        name="budget"
        value={formData.budget}
        onChange={(value) => handleFieldChange('budget', value)}
        onBlur={() => handleFieldBlur('budget')}
        unit="円"
        required
        error={touched.budget ? errors.budget : undefined}
        placeholder="例: 1000000"
        min={0}
        step={1000}
      />

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          aria-label="LED計算を実行"
        >
          計算する
        </button>
      </div>
    </form>
  );
};
