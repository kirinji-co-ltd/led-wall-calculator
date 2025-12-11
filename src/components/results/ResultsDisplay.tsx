'use client';

import { useState } from 'react';
import {
  Monitor,
  Maximize2,
  Grid3x3,
  Eye,
  DollarSign,
  Copy,
  Check,
  Layers,
  Ruler,
  Sparkles,
} from 'lucide-react';
import type { LEDWallCalculationResult } from '@/types/led-calculator';
import { LEDPanelLayout } from './LEDPanelLayout';
import {
  formatNumber,
  formatDimensions,
  formatPhysicalSize,
  formatArea,
  formatDistance,
  formatCurrency,
  formatPixelDensity,
  formatAspectRatio,
  formatPanelCount,
} from '@/lib/formatters';

export interface ResultsDisplayProps {
  result: LEDWallCalculationResult | null;
  isLoading?: boolean;
  className?: string;
}

/**
 * Enhanced results display component with visual LED panel layout,
 * animations, and copy functionality
 */
export const ResultsDisplay = ({
  result,
  isLoading = false,
  className = '',
}: ResultsDisplayProps) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatResultsAsText = (result: LEDWallCalculationResult): string => {
    const { resolution, physicalSize, pixelDensity, viewingDistance, panelCount, costEstimate, input } = result;
    const size = formatPhysicalSize(physicalSize.width, physicalSize.height);
    
    let text = '=== LED Wall 計算結果 ===\n\n';
    text += `【パネル構成】\n`;
    text += `総パネル数: ${formatPanelCount(panelCount, input.screenWidth, input.screenHeight)}\n`;
    text += `ピクセルピッチ: ${input.ledPitch} mm\n\n`;
    
    text += `【解像度】\n`;
    text += `総解像度: ${formatDimensions(resolution.width, resolution.height, 'px')}\n`;
    text += `総ピクセル数: ${formatNumber(resolution.totalPixels)}\n`;
    text += `ピクセル密度: ${formatPixelDensity(pixelDensity)}\n`;
    text += `アスペクト比: ${formatAspectRatio(resolution.width, resolution.height)}\n\n`;
    
    text += `【物理サイズ】\n`;
    text += `画面サイズ: ${size.meters}\n`;
    text += `画面サイズ(mm): ${size.millimeters}\n`;
    text += `総面積: ${formatArea(physicalSize.area)}\n\n`;
    
    text += `【推奨視聴距離】\n`;
    text += `最小距離: ${formatDistance(viewingDistance.minimum)}\n`;
    text += `最適距離: ${formatDistance(viewingDistance.optimal)}\n`;
    text += `最大距離: ${formatDistance(viewingDistance.maximum)}\n`;
    
    if (costEstimate) {
      text += `\n【コスト見積もり】\n`;
      text += `総費用: ${formatCurrency(costEstimate.totalCost)}\n`;
      text += `平方メートルあたり: ${formatCurrency(costEstimate.costPerSquareMeter)}/m²\n`;
    }
    
    return text;
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
          <div className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="space-y-3">
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 ${className}`}>
        <div className="text-center text-zinc-500 dark:text-zinc-400 py-12">
          <Monitor className="mx-auto h-16 w-16 mb-4 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
          <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
            計算結果がここに表示されます
          </p>
          <p className="text-sm mt-2">
            左のフォームに値を入力すると、リアルタイムで計算結果が表示されます
          </p>
        </div>
      </div>
    );
  }

  const { resolution, physicalSize, pixelDensity, viewingDistance, panelCount, costEstimate, input } = result;
  const size = formatPhysicalSize(physicalSize.width, physicalSize.height);

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header with Copy Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              計算結果
            </h2>
          </div>
          <button
            onClick={() => handleCopy(formatResultsAsText(result), 'all')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white text-sm font-medium"
            title="結果をコピー"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="w-4 h-4" />
                <span>コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>結果をコピー</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Visual LED Panel Layout */}
        <section className="animate-fadeIn">
          <LEDPanelLayout
            screenWidth={input.screenWidth}
            screenHeight={input.screenHeight}
          />
        </section>

        {/* Basic Information */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <SectionHeader
            icon={<Layers className="w-5 h-5" />}
            title="パネル構成"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MetricCard
              label="総パネル数"
              value={formatPanelCount(panelCount, input.screenWidth, input.screenHeight)}
              variant="highlight"
            />
            <MetricCard
              label="ピクセルピッチ"
              value={`${input.ledPitch} mm`}
              variant="default"
            />
          </div>
        </section>

        {/* Resolution */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <SectionHeader
            icon={<Grid3x3 className="w-5 h-5" />}
            title="解像度"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MetricCard
              label="総解像度"
              value={formatDimensions(resolution.width, resolution.height, 'px')}
              description={`${formatNumber(resolution.totalPixels)} ピクセル`}
              variant="highlight"
            />
            <MetricCard
              label="ピクセル密度"
              value={formatPixelDensity(pixelDensity)}
              variant="default"
            />
            <MetricCard
              label="アスペクト比"
              value={formatAspectRatio(resolution.width, resolution.height)}
              variant="default"
            />
          </div>
        </section>

        {/* Physical Size */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <SectionHeader
            icon={<Maximize2 className="w-5 h-5" />}
            title="物理サイズ"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <MetricCard
              label="画面サイズ"
              value={size.meters}
              description={size.millimeters}
              variant="highlight"
            />
            <MetricCard
              label="総面積"
              value={formatArea(physicalSize.area)}
              variant="default"
            />
          </div>
        </section>

        {/* Viewing Distance */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <SectionHeader
            icon={<Eye className="w-5 h-5" />}
            title="推奨視聴距離"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <MetricCard
              label="最小距離"
              value={formatDistance(viewingDistance.minimum)}
              variant="warning"
              icon={<Ruler className="w-4 h-4" />}
            />
            <MetricCard
              label="最適距離"
              value={formatDistance(viewingDistance.optimal)}
              variant="success"
              icon={<Ruler className="w-4 h-4" />}
            />
            <MetricCard
              label="最大距離"
              value={formatDistance(viewingDistance.maximum)}
              variant="info"
              icon={<Ruler className="w-4 h-4" />}
            />
          </div>
        </section>

        {/* Cost Estimate */}
        {costEstimate && (
          <section className="animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <SectionHeader
              icon={<DollarSign className="w-5 h-5" />}
              title="コスト見積もり"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <MetricCard
                label="総費用"
                value={formatCurrency(costEstimate.totalCost)}
                variant="highlight"
              />
              <MetricCard
                label="平方メートルあたり"
                value={`${formatCurrency(costEstimate.costPerSquareMeter)}/m²`}
                variant="default"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader = ({ icon, title }: SectionHeaderProps) => (
  <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
    <div className="text-blue-600 dark:text-blue-400">{icon}</div>
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}

const MetricCard = ({ 
  label, 
  value, 
  description, 
  variant = 'default',
  icon 
}: MetricCardProps) => {
  const variantClasses = {
    default: 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
    highlight: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800',
    warning: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    info: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
  };

  const textVariantClasses = {
    default: 'text-zinc-900 dark:text-zinc-100',
    highlight: 'text-blue-900 dark:text-blue-100',
    success: 'text-green-900 dark:text-green-100',
    warning: 'text-amber-900 dark:text-amber-100',
    info: 'text-sky-900 dark:text-sky-100',
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${variantClasses[variant]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
        {icon && <div className="text-zinc-400 dark:text-zinc-600">{icon}</div>}
      </div>
      <p className={`text-2xl font-bold mt-2 ${textVariantClasses[variant]}`}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
