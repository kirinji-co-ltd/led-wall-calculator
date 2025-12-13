'use client';

import type { LEDPanelModel } from '@/types/ledPanel';

export interface PanelDetailProps {
  /** Selected panel model to display details for */
  panel: LEDPanelModel;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Panel detail component for displaying detailed specifications of a selected LED panel
 */
export const PanelDetail = ({
  panel,
  className = '',
}: PanelDetailProps) => {
  return (
    <div 
      className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 lg:p-8 ${className}`}
      role="article"
      aria-label={`${panel.displayName}の詳細情報`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {panel.displayName}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {panel.series}シリーズ - {panel.modelNumber}
            </p>
          </div>
          <div className="flex-shrink-0 px-3 py-1 bg-blue-100 dark:bg-blue-950 rounded-full">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              P{panel.pixelPitch}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-base text-zinc-700 dark:text-zinc-300 mt-4">
          {panel.description}
        </p>
      </div>

      {/* Image placeholder */}
      {panel.imageUrl && (
        <div className="mb-6 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img 
            src={panel.imageUrl} 
            alt={`${panel.displayName}のイメージ`}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Specifications Grid */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            技術仕様
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Panel Size */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                パネルサイズ
              </dt>
              <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {panel.panelWidth} × {panel.panelHeight} mm
              </dd>
            </div>

            {/* Pixel Pitch */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                ピクセルピッチ
              </dt>
              <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {panel.pixelPitch} mm
              </dd>
            </div>

            {/* Brightness */}
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                輝度
              </dt>
              <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {panel.brightness} nits
              </dd>
            </div>

            {/* Weight */}
            {panel.weight && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  重量
                </dt>
                <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {panel.weight} kg
                </dd>
              </div>
            )}

            {/* Power Consumption */}
            {panel.powerConsumption && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  消費電力
                </dt>
                <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {panel.powerConsumption} W
                </dd>
              </div>
            )}

            {/* Refresh Rate */}
            {panel.refreshRate && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  リフレッシュレート
                </dt>
                <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {panel.refreshRate} Hz
                </dd>
              </div>
            )}

            {/* Viewing Angle */}
            {panel.viewingAngle && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  視野角
                </dt>
                <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {panel.viewingAngle}°
                </dd>
              </div>
            )}

            {/* Price */}
            {panel.pricePerPanel && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  価格（1枚あたり）
                </dt>
                <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  ¥{panel.pricePerPanel.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Use Case */}
        {panel.useCase && (
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              推奨用途
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {panel.useCase}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
