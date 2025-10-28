"use client";

/**
 * Error display component
 * Shows user-friendly error messages
 */

import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";

export function ErrorDisplay() {
  const error = useAppStore((state) => state.processing.error);
  const setError = useAppStore((state) => state.setError);

  if (!error) {
    return null;
  }

  const handleDismiss = () => {
    setError(null);
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border",
        "bg-red-50 dark:bg-red-900/20",
        "border-red-200 dark:border-red-800"
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <svg
          className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>

        <div className="flex-1 min-w-0">
          {/* Error message */}
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
            {error.message}
          </h3>

          {/* Error details */}
          {error.details && (
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error.details}</p>
          )}

          {/* Error code */}
          <p className="mt-2 text-xs text-red-600 dark:text-red-500 font-mono">
            Error Code: {error.code}
          </p>

          {/* Recoverable status */}
          {!error.recoverable && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
              This error cannot be recovered automatically. Please refresh the page.
            </p>
          )}
        </div>

        {/* Dismiss button */}
        {error.recoverable && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-md",
              "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40",
              "focus:outline-none focus:ring-2 focus:ring-red-500"
            )}
            aria-label="Dismiss error"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
