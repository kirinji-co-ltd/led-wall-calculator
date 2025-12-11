'use client';

import { Grid3x3, Monitor } from 'lucide-react';

export interface LEDPanelLayoutProps {
  screenWidth: number;
  screenHeight: number;
  className?: string;
}

/**
 * Visual representation of LED panel layout
 */
export const LEDPanelLayout = ({
  screenWidth,
  screenHeight,
  className = '',
}: LEDPanelLayoutProps) => {
  // Calculate grid display - limit to reasonable size for visualization
  const maxDisplayPanels = 20;
  const totalPanels = screenWidth * screenHeight;
  const shouldSimplify = totalPanels > maxDisplayPanels;
  
  // For large configurations, show a simplified representation
  if (shouldSimplify) {
    return (
      <div className={`bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
          <Monitor className="w-16 h-16 text-zinc-400 dark:text-zinc-600" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {screenWidth} × {screenHeight}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              パネル構成
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate panel size based on total panels
  const calculatePanelSize = () => {
    const baseSize = 40;
    const minSize = 20;
    const scaleFactor = Math.max(1, totalPanels / 8);
    return Math.max(minSize, baseSize / Math.sqrt(scaleFactor));
  };

  const panelSize = calculatePanelSize();
  const gap = Math.max(2, panelSize / 10);

  return (
    <div className={`bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-6 ${className}`}>
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-2 mb-4">
          <Grid3x3 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            パネルレイアウト: {screenWidth} × {screenHeight}
          </p>
        </div>
        
        <div 
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${screenWidth}, ${panelSize}px)`,
            gridTemplateRows: `repeat(${screenHeight}, ${panelSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: totalPanels }).map((_, index) => {
            const row = Math.floor(index / screenWidth);
            const col = index % screenWidth;
            const isEdge = row === 0 || row === screenHeight - 1 || col === 0 || col === screenWidth - 1;
            
            return (
              <div
                key={index}
                className={`
                  rounded transition-all duration-200 hover:scale-110
                  ${isEdge 
                    ? 'bg-blue-500 dark:bg-blue-600 shadow-md' 
                    : 'bg-blue-400 dark:bg-blue-700'}
                `}
                style={{
                  width: `${panelSize}px`,
                  height: `${panelSize}px`,
                }}
                title={`パネル ${row + 1}-${col + 1}`}
              />
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            合計 {totalPanels} パネル
          </p>
        </div>
      </div>
    </div>
  );
};
