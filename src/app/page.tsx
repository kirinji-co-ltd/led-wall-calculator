'use client';

import { LEDPanelForm } from '@/components/form';
import type { LEDPanelFormData } from '@/types/ledPanel';

export default function Home() {
  const handleSubmit = (data: LEDPanelFormData) => {
    console.log('Form submitted:', data);
    // TODO: Implement calculation logic
  };

  const handleChange = (data: LEDPanelFormData) => {
    // Real-time updates can be handled here if needed
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            LEDウォール計算機
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            LEDパネルの仕様を入力して、画面サイズや解像度を計算します
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            LEDパネル仕様入力
          </h2>
          <LEDPanelForm
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            参考: <a 
              href="https://www.ledwallcentral.com/led-wall-calculator.cfm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LED Wall Central Calculator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
