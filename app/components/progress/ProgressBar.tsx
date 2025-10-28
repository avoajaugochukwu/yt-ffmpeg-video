"use client";

/**
 * Progress bar component
 * Displays real-time progress during video generation
 */

import { useEffect, useState } from "react";
import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";
import { formatDuration } from "../../lib/audio/duration";

export function ProgressBar() {
  const processing = useAppStore((state) => state.processing);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Extract values before conditional return
  const startTime = processing.progress?.startTime;
  const percentage = processing.progress?.percentage ?? 0;
  const currentStep = processing.progress?.currentStep ?? "";

  // Update elapsed time every second
  useEffect(() => {
    if (!startTime) {
      setElapsedSeconds(0);
      return;
    }

    // Calculate initial elapsed time
    setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));

    // Update every second
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Early return AFTER all hooks
  if (processing.state !== "processing" || !processing.progress) {
    return null;
  }

  return (
    <div className="space-y-3 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      {/* Warning message */}
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
          Do not close this tab during processing
        </p>
      </div>

      {/* Current step */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {currentStep}
        </p>
      </div>

      {/* Elapsed time */}
      {startTime && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Elapsed: {formatDuration(elapsedSeconds)}
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="relative">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full bg-gradient-to-r from-blue-500 to-blue-600",
              "transition-all duration-300 ease-out",
              "relative overflow-hidden"
            )}
            style={{ width: `${percentage}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200 drop-shadow-sm">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Spinner */}
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    </div>
  );
}
