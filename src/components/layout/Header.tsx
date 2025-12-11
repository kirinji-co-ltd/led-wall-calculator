'use client';

export interface HeaderProps {
  className?: string;
}

/**
 * Application header with title and navigation
 */
export const Header = ({ className = '' }: HeaderProps) => {
  return (
    <header className={`bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg" aria-hidden="true">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                LEDウォール計算機
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                LED Wall Calculator
              </p>
            </div>
          </div>
          
          <nav aria-label="主要なナビゲーション" className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.ledwallcentral.com/led-wall-calculator.cfm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded"
            >
              参考サイト
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
