"use client";

/**
 * Background music input component
 * Accepts an optional background music file to be mixed with primary audio
 */

import { useRef } from "react";
import { useAppStore } from "../../store";
import { validateAudioFile } from "../../lib/utils/validation";
import { cn } from "../../lib/utils/cn";

export function BackgroundMusicInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundMusic = useAppStore((state) => state.files.backgroundMusic);
  const setBackgroundMusic = useAppStore((state) => state.setBackgroundMusic);
  const setError = useAppStore((state) => state.setError);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the file
    const validation = validateAudioFile(file);
    if (!validation.valid && validation.error) {
      setError(validation.error);
      return;
    }

    // Clear any previous errors
    setError(null);

    // Set the background music file
    setBackgroundMusic(file);
  };

  const handleRemove = () => {
    setBackgroundMusic(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Background Music <span className="text-gray-400">(Optional)</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add background music to be mixed with the primary audio
      </p>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.aac,.m4a"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload background music file"
        />

        <button
          onClick={handleClick}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            "bg-gray-100 text-gray-700 hover:bg-gray-200",
            "dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
            "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          )}
        >
          Choose Music File
        </button>

        {backgroundMusic && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {backgroundMusic.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(backgroundMusic.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleRemove}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                "focus:outline-none focus:ring-2 focus:ring-red-500"
              )}
              aria-label="Remove background music"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
