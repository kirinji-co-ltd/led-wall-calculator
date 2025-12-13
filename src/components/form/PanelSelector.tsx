'use client';

import { useState } from 'react';
import type { LEDPanelModel } from '@/types/ledPanel';

export interface PanelSelectorProps {
  /** Available panel models */
  panels: LEDPanelModel[];
  /** Currently selected panel ID */
  selectedPanelId?: string;
  /** Callback when panel is selected */
  onSelect: (panel: LEDPanelModel) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Panel selector component for choosing LED panel models
 */
export const PanelSelector = ({
  panels,
  selectedPanelId,
  onSelect,
  className = '',
}: PanelSelectorProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (panels.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        利用可能なパネルモデルがありません
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        LEDパネルモデルを選択
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {panels.map((panel) => {
          const isSelected = selectedPanelId === panel.id;
          const isHovered = hoveredId === panel.id;

          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => onSelect(panel)}
              onMouseEnter={() => setHoveredId(panel.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                  : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-300 dark:hover:border-blue-700'
                }
                ${isHovered && !isSelected ? 'shadow-md' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900
              `}
              aria-pressed={isSelected}
              aria-label={`${panel.displayName}を選択`}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Model number and series */}
              <div className="mb-3">
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {panel.modelNumber}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {panel.series}シリーズ
                </p>
              </div>

              {/* Key specs */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">ピクセルピッチ</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    P{panel.pixelPitch}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">パネルサイズ</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {panel.panelWidth} × {panel.panelHeight}mm
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">輝度</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {panel.brightness} nits
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                {panel.description}
              </p>

              {/* Use case */}
              {panel.useCase && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  推奨: {panel.useCase}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
