'use client';

import { useState, useCallback } from 'react';
import { LEDPanelForm } from '@/components/form';
import { CalculationResult } from '@/components/results';
import { Header, Footer, ErrorBoundary } from '@/components/layout';
import { calculateLEDWall } from '@/lib/calculations';
import type { LEDPanelFormData } from '@/types/ledPanel';
import type { LEDWallCalculationResult, LEDWallInput } from '@/types/led-calculator';

export default function Home() {
  const [result, setResult] = useState<LEDWallCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performCalculation = useCallback((data: LEDPanelFormData) => {
    try {
      setIsCalculating(true);
      setError(null);

      // Validate that all required fields have valid values
      if (data.panelWidth <= 0 || data.panelHeight <= 0 || 
          data.screenWidth <= 0 || data.screenHeight <= 0 || 
          data.ledPitch <= 0) {
        setResult(null);
        return;
      }

      const input: LEDWallInput = {
        panelWidth: data.panelWidth,
        panelHeight: data.panelHeight,
        screenWidth: data.screenWidth,
        screenHeight: data.screenHeight,
        ledPitch: data.ledPitch,
      };

      const calculationResult = calculateLEDWall(input);
      setResult(calculationResult);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : '計算エラーが発生しました');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleSubmit = useCallback((data: LEDPanelFormData) => {
    performCalculation(data);
  }, [performCalculation]);

  const handleChange = useCallback((data: LEDPanelFormData) => {
    // Real-time calculation on form change
    performCalculation(data);
  }, [performCalculation]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <Header />
        
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                LEDパネルの仕様を入力して、画面サイズや解像度を計算します
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form Section */}
              <div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 lg:p-8">
                  <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
                    LEDパネル仕様入力
                  </h2>
                  <LEDPanelForm
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Results Section */}
              <div>
                {error ? (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl shadow-lg p-6 lg:p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <svg
                        className="w-6 h-6 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                        計算エラー
                      </h3>
                    </div>
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                ) : (
                  <CalculationResult result={result} isLoading={isCalculating} />
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
