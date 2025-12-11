'use client';

import { useState, useEffect, useRef } from 'react';
import type { LEDPreset } from '@/types/preset';
import { getCategoryLabel } from '@/lib/presets';
import { getAllPresets } from '@/lib/presetStorage';

export interface PresetSelectorProps {
  /** Callback when a preset is selected */
  onSelect: (preset: LEDPreset) => void;
  /** Currently selected preset ID */
  selectedId?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Dropdown selector for LED panel presets
 */
export const PresetSelector = ({
  onSelect,
  selectedId,
  className = '',
}: PresetSelectorProps) => {
  const [presets, setPresets] = useState<LEDPreset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load presets on mount and when localStorage changes
    const loadPresets = () => {
      const allPresets = getAllPresets();
      setPresets(allPresets);
    };

    loadPresets();

    // Listen for storage events (when other tabs modify presets)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'led-calculator-presets') {
        loadPresets();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev < presets.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : presets.length - 1));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && presets[focusedIndex]) {
            handlePresetClick(presets[focusedIndex]);
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(presets.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, presets]);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.querySelector(`[data-index="${focusedIndex}"]`);
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const selectedPreset = presets.find(p => p.id === selectedId);

  // Group presets by category
  const groupedPresets = presets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, LEDPreset[]>);

  const handlePresetClick = (preset: LEDPreset) => {
    onSelect(preset);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(presets.findIndex(p => p.id === selectedId));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label 
        id="preset-selector-label"
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
      >
        プリセットから選択
      </label>
      
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="preset-selector-label"
        className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <span className="block text-sm text-zinc-900 dark:text-zinc-100">
          {selectedPreset ? selectedPreset.name : 'プリセットを選択'}
        </span>
        {selectedPreset && (
          <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {selectedPreset.description}
          </span>
        )}
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setFocusedIndex(-1);
            }}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div 
            ref={dropdownRef}
            role="listbox"
            aria-labelledby="preset-selector-label"
            className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {Object.entries(groupedPresets).map(([category, categoryPresets], categoryIndex) => {
              const categoryStartIndex = Object.entries(groupedPresets)
                .slice(0, categoryIndex)
                .reduce((sum, [, presets]) => sum + presets.length, 0);
              
              return (
                <div key={category} className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {getCategoryLabel(category as LEDPreset['category'])}
                  </div>
                  {categoryPresets.map((preset, index) => {
                    const globalIndex = categoryStartIndex + index;
                    const isFocused = focusedIndex === globalIndex;
                    const isSelected = selectedId === preset.id;
                    
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-index={globalIndex}
                        onClick={() => handlePresetClick(preset)}
                        className={`w-full px-4 py-3 text-left transition-colors focus:outline-none ${
                          isFocused ? 'bg-zinc-200 dark:bg-zinc-600' : ''
                        } ${
                          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } ${
                          !isFocused && !isSelected ? 'hover:bg-zinc-100 dark:hover:bg-zinc-700' : ''
                        }`}
                      >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {preset.name}
                          {preset.isCustom && (
                            <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                              カスタム
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {preset.description}
                        </span>
                        <span className="block text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                          {preset.panelWidth}×{preset.panelHeight}mm, P{preset.ledPitch}
                        </span>
                      </div>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
          </div>
        </>
      )}
    </div>
  );
};
