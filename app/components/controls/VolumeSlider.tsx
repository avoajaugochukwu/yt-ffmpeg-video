"use client";

/**
 * Volume slider component
 * Controls background music volume (0-50%)
 */

import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";

export function VolumeSlider() {
  const volume = useAppStore((state) => state.settings.backgroundMusicVolume);
  const setVolume = useAppStore((state) => state.setBackgroundMusicVolume);
  const hasBackgroundMusic = useAppStore((state) => state.files.backgroundMusic !== null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="volume-slider"
          className={cn(
            "block text-sm font-medium",
            hasBackgroundMusic
              ? "text-gray-700 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-600"
          )}
        >
          Background Music Volume
        </label>
        <span
          className={cn(
            "text-sm font-semibold",
            hasBackgroundMusic
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 dark:text-gray-600"
          )}
        >
          {volume}%
        </span>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {hasBackgroundMusic
          ? "Adjust volume relative to primary audio (0-50%)"
          : "Upload background music to enable volume control"}
      </p>

      <input
        id="volume-slider"
        type="range"
        min="0"
        max="50"
        step="1"
        value={volume}
        onChange={handleChange}
        disabled={!hasBackgroundMusic}
        className={cn(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          "bg-gray-200 dark:bg-gray-700",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:h-4",
          "[&::-webkit-slider-thumb]:rounded-full",
          "[&::-webkit-slider-thumb]:bg-blue-600",
          "[&::-webkit-slider-thumb]:hover:bg-blue-700",
          "[&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:h-4",
          "[&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-blue-600",
          "[&::-moz-range-thumb]:hover:bg-blue-700",
          "[&::-moz-range-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:border-0",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        aria-label="Background music volume"
        aria-valuemin={0}
        aria-valuemax={50}
        aria-valuenow={volume}
      />

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
      </div>
    </div>
  );
}
