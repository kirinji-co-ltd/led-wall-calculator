'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Move } from 'lucide-react';

export interface LEDPreviewProps {
  /** 横のパネル数 */
  screenWidth: number;
  /** 縦のパネル数 */
  screenHeight: number;
  /** 個々のパネルの幅 (mm) */
  panelWidth: number;
  /** 個々のパネルの高さ (mm) */
  panelHeight: number;
  /** LEDピッチ (mm) */
  ledPitch?: number;
  /** 表示モード */
  mode?: 'compact' | 'detailed';
  /** カスタムクラス */
  className?: string;
}

interface ViewState {
  offsetX: number;
  offsetY: number;
  scale: number;
}

interface PanelInfo {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Enhanced LED Panel Layout Preview with Canvas rendering
 * Supports zoom, pan, and interactive tooltips
 */
export const LEDPreview = ({
  screenWidth,
  screenHeight,
  panelWidth,
  panelHeight,
  ledPitch,
  mode = 'detailed',
  className = '',
}: LEDPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate optimal initial scale to fit panels in viewport
  const calculateInitialScale = useCallback(() => {
    if (!containerRef.current) return 1;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 100; // Padding
    const containerHeight = container.clientHeight - 100;
    
    const totalWidth = screenWidth * panelWidth;
    const totalHeight = screenHeight * panelHeight;
    
    const scaleX = containerWidth / totalWidth;
    const scaleY = containerHeight / totalHeight;
    
    return Math.min(scaleX, scaleY, 2); // Max scale of 2x
  }, [screenWidth, screenHeight, panelWidth, panelHeight]);

  const [viewState, setViewState] = useState<ViewState>(() => ({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPanel, setHoveredPanel] = useState<PanelInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update scale when dimensions change
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialScale = calculateInitialScale();
      setViewState(prev => ({ ...prev, scale: initialScale }));
    }, 100); // Debounce to avoid excessive updates
    
    return () => clearTimeout(timer);
  }, [calculateInitialScale]);

  // Draw the LED panel layout
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = containerRef.current;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations (pan and zoom)
    ctx.translate(canvas.width / 2 + viewState.offsetX, canvas.height / 2 + viewState.offsetY);
    ctx.scale(viewState.scale, viewState.scale);

    // Calculate total dimensions
    const totalWidth = screenWidth * panelWidth;
    const totalHeight = screenHeight * panelHeight;

    // Center the grid
    ctx.translate(-totalWidth / 2, -totalHeight / 2);

    // Draw grid background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
      ? '#18181b'
      : '#f4f4f5';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw panels
    for (let row = 0; row < screenHeight; row++) {
      for (let col = 0; col < screenWidth; col++) {
        const x = col * panelWidth;
        const y = row * panelHeight;
        
        const isHovered = hoveredPanel?.row === row && hoveredPanel?.col === col;
        const isEdge = row === 0 || row === screenHeight - 1 || col === 0 || col === screenWidth - 1;

        // Panel fill
        if (isHovered) {
          ctx.fillStyle = '#3b82f6'; // blue-500
        } else if (isEdge) {
          ctx.fillStyle = '#60a5fa'; // blue-400
        } else {
          ctx.fillStyle = '#93c5fd'; // blue-300
        }
        
        ctx.fillRect(x + 1, y + 1, panelWidth - 2, panelHeight - 2);

        // Panel border
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
          ? '#27272a'
          : '#e4e4e7';
        ctx.lineWidth = 2 / viewState.scale;
        ctx.strokeRect(x, y, panelWidth, panelHeight);

        // Draw panel number for small grids or when zoomed in
        if ((screenWidth * screenHeight <= 100 || viewState.scale > 0.5) && mode === 'detailed') {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('color-scheme') === 'dark'
            ? '#ffffff'
            : '#000000';
          ctx.font = `${Math.max(12, 20 / viewState.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${row + 1}-${col + 1}`, x + panelWidth / 2, y + panelHeight / 2);
        }
      }
    }

    // Draw coordinate axes and dimensions
    if (mode === 'detailed') {
      ctx.strokeStyle = '#6366f1'; // indigo-500
      ctx.lineWidth = 2 / viewState.scale;
      ctx.setLineDash([5 / viewState.scale, 5 / viewState.scale]);

      // Width dimension
      ctx.beginPath();
      ctx.moveTo(0, -20 / viewState.scale);
      ctx.lineTo(totalWidth, -20 / viewState.scale);
      ctx.stroke();

      // Height dimension
      ctx.beginPath();
      ctx.moveTo(-20 / viewState.scale, 0);
      ctx.lineTo(-20 / viewState.scale, totalHeight);
      ctx.stroke();

      ctx.setLineDash([]);

      // Dimension text
      ctx.fillStyle = '#6366f1';
      ctx.font = `bold ${Math.max(14, 24 / viewState.scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${totalWidth} mm`, totalWidth / 2, -35 / viewState.scale);
      
      ctx.save();
      ctx.translate(-35 / viewState.scale, totalHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${totalHeight} mm`, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  }, [screenWidth, screenHeight, panelWidth, panelHeight, viewState, hoveredPanel, mode]);

  // Redraw on state changes
  useEffect(() => {
    draw();
  }, [draw]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      draw();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - viewState.offsetX, y: e.clientY - viewState.offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setViewState(prev => ({
        ...prev,
        offsetX: e.clientX - dragStart.x,
        offsetY: e.clientY - dragStart.y,
      }));
    } else {
      // Update tooltip position and check for hovered panel
      updateHoveredPanel(e.clientX, e.clientY);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoveredPanel(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - viewState.offsetX, y: touch.clientY - viewState.offsetY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setViewState(prev => ({
        ...prev,
        offsetX: touch.clientX - dragStart.x,
        offsetY: touch.clientY - dragStart.y,
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom with wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(10, viewState.scale * zoomFactor));
    
    setViewState(prev => ({
      ...prev,
      scale: newScale,
    }));
  };

  // Update hovered panel based on mouse position
  const updateHoveredPanel = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Transform mouse coordinates to canvas space
    const centerX = canvas.width / 2 + viewState.offsetX;
    const centerY = canvas.height / 2 + viewState.offsetY;
    
    const totalWidth = screenWidth * panelWidth;
    const totalHeight = screenHeight * panelHeight;
    
    const canvasX = ((mouseX - centerX) / viewState.scale) + totalWidth / 2;
    const canvasY = ((mouseY - centerY) / viewState.scale) + totalHeight / 2;

    // Check if mouse is over any panel
    if (canvasX >= 0 && canvasX <= totalWidth && canvasY >= 0 && canvasY <= totalHeight) {
      const col = Math.floor(canvasX / panelWidth);
      const row = Math.floor(canvasY / panelHeight);
      
      if (row >= 0 && row < screenHeight && col >= 0 && col < screenWidth) {
        setHoveredPanel({
          row,
          col,
          x: col * panelWidth,
          y: row * panelHeight,
          width: panelWidth,
          height: panelHeight,
        });
        return;
      }
    }
    
    setHoveredPanel(null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setViewState(prev => ({
      ...prev,
      scale: Math.min(10, prev.scale * 1.2),
    }));
  };

  const handleZoomOut = () => {
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.1, prev.scale / 1.2),
    }));
  };

  const handleResetView = () => {
    const initialScale = calculateInitialScale();
    setViewState({
      offsetX: 0,
      offsetY: 0,
      scale: initialScale,
    });
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const totalPanels = screenWidth * screenHeight;
  const totalWidth = (screenWidth * panelWidth) / 1000; // Convert to meters
  const totalHeight = (screenHeight * panelHeight) / 1000;

  return (
    <div className={`relative bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header with info */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 z-10 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {screenWidth} × {screenHeight} パネル
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {totalPanels} 枚
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              {totalWidth.toFixed(2)}m × {totalHeight.toFixed(2)}m
            </span>
            {ledPitch && (
              <span className="text-zinc-600 dark:text-zinc-400">
                P{ledPitch}mm
              </span>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-300 dark:border-zinc-600"
              title="ズームアウト"
              aria-label="ズームアウト"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-300 dark:border-zinc-600"
              title="ズームイン"
              aria-label="ズームイン"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-300 dark:border-zinc-600"
              title="リセット"
              aria-label="ビューをリセット"
            >
              <Move className="w-4 h-4" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors border border-zinc-300 dark:border-zinc-600"
              title={isFullscreen ? '全画面を解除' : '全画面表示'}
              aria-label={isFullscreen ? '全画面を解除' : '全画面表示'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full min-h-[400px] pt-16"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full"
          role="img"
          aria-label={`LED panel layout: ${screenWidth} columns by ${screenHeight} rows`}
        />
      </div>

      {/* Tooltip */}
      {hoveredPanel && (
        <div
          className="absolute pointer-events-none bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-900 px-3 py-2 rounded-lg shadow-lg text-sm z-20"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y + 10}px`,
          }}
        >
          <div className="font-semibold">パネル {hoveredPanel.row + 1}-{hoveredPanel.col + 1}</div>
          <div className="text-xs mt-1 space-y-0.5 opacity-90">
            <div>位置: Row {hoveredPanel.row + 1}, Col {hoveredPanel.col + 1}</div>
            <div>サイズ: {panelWidth} × {panelHeight} mm</div>
            {ledPitch && <div>ピッチ: {ledPitch} mm</div>}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="absolute bottom-4 left-4 text-xs text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-3 py-2 rounded-lg">
        マウスドラッグで移動 | ホイールでズーム | パネルにホバーで詳細表示
      </div>
    </div>
  );
};
