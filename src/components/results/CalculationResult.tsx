'use client';

import type { LEDWallCalculationResult } from '@/types/led-calculator';

export interface CalculationResultProps {
  result: LEDWallCalculationResult | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * Displays LED Wall calculation results
 */
export const CalculationResult = ({
  result,
  isLoading = false,
  className = '',
}: CalculationResultProps) => {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 ${className}`}>
        <div className="text-center text-zinc-500 dark:text-zinc-400">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg font-medium">計算結果がここに表示されます</p>
          <p className="text-sm mt-2">上のフォームに値を入力して計算を実行してください</p>
        </div>
      </div>
    );
  }

  const { resolution, physicalSize, pixelDensity, viewingDistance, panelCount, costEstimate } = result;

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 ${className}`}>
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
        計算結果
      </h2>

      <div className="space-y-6">
        {/* Panel Count */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
            パネル構成
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <ResultItem
              label="総パネル数"
              value={`${panelCount}枚`}
              description={`${result.input.screenWidth} × ${result.input.screenHeight}`}
            />
          </div>
        </section>

        {/* Resolution */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
            解像度
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ResultItem
              label="総解像度"
              value={`${resolution.width} × ${resolution.height}`}
              description={`${resolution.totalPixels.toLocaleString()}ピクセル`}
            />
            <ResultItem
              label="ピクセル密度"
              value={`${pixelDensity.toLocaleString()}`}
              description="ピクセル/m²"
            />
          </div>
        </section>

        {/* Physical Size */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
            物理サイズ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ResultItem
              label="画面サイズ"
              value={`${(physicalSize.width / 1000).toFixed(2)} × ${(physicalSize.height / 1000).toFixed(2)}m`}
              description={`${physicalSize.width} × ${physicalSize.height}mm`}
            />
            <ResultItem
              label="総面積"
              value={`${physicalSize.area.toFixed(2)}m²`}
            />
          </div>
        </section>

        {/* Viewing Distance */}
        <section>
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
            推奨視聴距離
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ResultItem
              label="最小距離"
              value={`${viewingDistance.minimum}m`}
              variant="warning"
            />
            <ResultItem
              label="最適距離"
              value={`${viewingDistance.optimal}m`}
              variant="success"
            />
            <ResultItem
              label="最大距離"
              value={`${viewingDistance.maximum}m`}
              variant="info"
            />
          </div>
        </section>

        {/* Cost Estimate */}
        {costEstimate && (
          <section>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
              コスト見積もり
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ResultItem
                label="総費用"
                value={`¥${costEstimate.totalCost.toLocaleString()}`}
              />
              <ResultItem
                label="平方メートルあたり"
                value={`¥${costEstimate.costPerSquareMeter.toLocaleString()}/m²`}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

interface ResultItemProps {
  label: string;
  value: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const ResultItem = ({ label, value, description, variant = 'default' }: ResultItemProps) => {
  const variantClasses = {
    default: 'bg-zinc-50 dark:bg-zinc-800',
    success: 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800',
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]}`}>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{label}</p>
      <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{description}</p>
      )}
    </div>
  );
};
