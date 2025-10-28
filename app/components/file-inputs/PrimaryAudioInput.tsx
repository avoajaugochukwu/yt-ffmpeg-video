"use client";

/**
 * Primary audio input component
 * Accepts a single audio file for the video's main audio track
 */

import { useRef } from "react";
import { useAppStore } from "../../store";
import { validateAudioFile } from "../../lib/utils/validation";
import { cn } from "../../lib/utils/cn";

export function PrimaryAudioInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryAudio = useAppStore((state) => state.files.primaryAudio);
  const setPrimaryAudio = useAppStore((state) => state.setPrimaryAudio);
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

    // Set the audio file
    setPrimaryAudio(file);
  };

  const handleRemove = () => {
    setPrimaryAudio(null);
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
        Primary Audio <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Upload the main audio track for your video (MP3, WAV, AAC, M4A)
      </p>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.aac,.m4a"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload primary audio file"
        />

        <button
          onClick={handleClick}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            "bg-blue-600 text-white hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Choose Audio File
        </button>

        {primaryAudio && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {primaryAudio.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(primaryAudio.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleRemove}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                "focus:outline-none focus:ring-2 focus:ring-red-500"
              )}
              aria-label="Remove audio file"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
