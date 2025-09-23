'use client';

import { ScrapingProgress } from '@/types';

interface ProgressBarProps {
  progress: ScrapingProgress;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const getProgressPercentage = () => {
    if (progress.total === 0) return 0;
    return Math.round((progress.geocoded / progress.total) * 100);
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'scraping':
        return `Scraping projects... (${progress.scraped}/${progress.total})`;
      case 'geocoding':
        return `Getting locations... (${progress.geocoded}/${progress.total})`;
      case 'completed':
        return `Completed! Found ${progress.total} projects`;
      case 'error':
        return `Error: ${progress.error || 'Unknown error occurred'}`;
      default:
        return 'Ready to start...';
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
        <span className="text-sm text-gray-500">
          {progressPercentage}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress.status === 'error'
              ? 'bg-red-500'
              : progress.status === 'completed'
              ? 'bg-green-500'
              : 'bg-blue-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {progress.status === 'scraping' || progress.status === 'geocoding' ? (
        <div className="mt-2 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-xs text-gray-500">Processing...</span>
        </div>
      ) : null}
    </div>
  );
};

export default ProgressBar;