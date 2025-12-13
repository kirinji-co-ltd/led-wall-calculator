'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [pixelPitchFilter, setPixelPitchFilter] = useState<string>('all');
  const [brightnessFilter, setBrightnessFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique pixel pitch and brightness values for filter options
  const filterOptions = useMemo(() => {
    const pitches = Array.from(new Set(panels.map(p => p.pixelPitch))).sort((a, b) => a - b);
    const brightnesses = Array.from(new Set(panels.map(p => p.brightness))).sort((a, b) => a - b);
    return { pitches, brightnesses };
  }, [panels]);

  // Filter panels based on search and filters
  const filteredPanels = useMemo(() => {
    return panels.filter(panel => {
      // Search filter (case-insensitive match on model number, series, description, use case)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        panel.modelNumber.toLowerCase().includes(searchLower) ||
        panel.series.toLowerCase().includes(searchLower) ||
        panel.description.toLowerCase().includes(searchLower) ||
        (panel.useCase?.toLowerCase().includes(searchLower) ?? false);

      // Pixel pitch filter
      const matchesPitch = pixelPitchFilter === 'all' || 
        panel.pixelPitch.toString() === pixelPitchFilter;

      // Brightness filter
      const matchesBrightness = brightnessFilter === 'all' || 
        panel.brightness.toString() === brightnessFilter;

      return matchesSearch && matchesPitch && matchesBrightness;
    });
  }, [panels, searchQuery, pixelPitchFilter, brightnessFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setPixelPitchFilter('all');
    setBrightnessFilter('all');
  };

  const hasActiveFilters = searchQuery || pixelPitchFilter !== 'all' || brightnessFilter !== 'all';

  if (panels.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
        利用可能なパネルモデルがありません
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          LEDパネルモデルを選択
        </h3>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          aria-expanded={showFilters}
          aria-label={showFilters ? 'フィルタを非表示' : 'フィルタを表示'}
        >
          <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          <span>{showFilters ? 'フィルタを非表示' : 'フィルタを表示'}</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className={`space-y-4 mb-6 transition-all duration-200 ${showFilters ? 'block' : 'hidden'}`}>
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="モデル名、シリーズ、用途で検索..."
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="パネルを検索"
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Pixel Pitch Filter */}
          <div>
            <label 
              htmlFor="pixel-pitch-filter"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              ピクセルピッチ
            </label>
            <select
              id="pixel-pitch-filter"
              value={pixelPitchFilter}
              onChange={(e) => setPixelPitchFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              {filterOptions.pitches.map(pitch => (
                <option key={pitch} value={pitch}>P{pitch}</option>
              ))}
            </select>
          </div>

          {/* Brightness Filter */}
          <div>
            <label 
              htmlFor="brightness-filter"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              輝度
            </label>
            <select
              id="brightness-filter"
              value={brightnessFilter}
              onChange={(e) => setBrightnessFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              {filterOptions.brightnesses.map(brightness => (
                <option key={brightness} value={brightness}>{brightness} nits</option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-full px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              aria-label="フィルタをリセット"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredPanels.length === panels.length ? (
            <span>{panels.length}件のパネルを表示中</span>
          ) : (
            <span>
              {filteredPanels.length}件のパネルを表示中（全{panels.length}件中）
            </span>
          )}
        </div>
      </div>

      {/* No Results Message */}
      {filteredPanels.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-2">
            条件に一致するパネルが見つかりませんでした
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            フィルタをリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPanels.map((panel) => {
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
      )}
    </div>
  );
};
