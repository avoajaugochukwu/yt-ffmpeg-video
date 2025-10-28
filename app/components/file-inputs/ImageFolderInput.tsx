"use client";

/**
 * Image folder input component
 * Accepts multiple image files and displays count
 */

import { useRef } from "react";
import { useAppStore } from "../../store";
import { validateImageFiles } from "../../lib/utils/validation";
import {
  loadImagesWithMetadata,
  sortImagesIntelligently,
  findHighestResolution,
} from "../../lib/utils/image-loader";
import { cn } from "../../lib/utils/cn";

export function ImageFolderInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const images = useAppStore((state) => state.files.images);
  const addImages = useAppStore((state) => state.addImages);
  const clearImages = useAppStore((state) => state.clearImages);
  const setError = useAppStore((state) => state.setError);
  const setOutputResolution = useAppStore((state) => state.setOutputResolution);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    // Validate all files
    const validation = validateImageFiles(files);

    // Show errors if any files are invalid
    if (validation.errors.length > 0) {
      const firstError = validation.errors[0].error;
      setError(firstError);
      // Still proceed with valid files if any
    } else {
      setError(null);
    }

    // If no valid files, return
    if (validation.validFiles.length === 0) return;

    try {
      // Load images with metadata
      const loadedImages = await loadImagesWithMetadata(
        validation.validFiles,
        images.length
      );

      // Sort images intelligently
      const sortedImages = sortImagesIntelligently(loadedImages);

      // Add to store
      addImages(sortedImages);

      // Update output resolution based on highest resolution image
      const allImages = [...images, ...sortedImages];
      const highestRes = findHighestResolution(allImages);
      if (highestRes) {
        setOutputResolution(highestRes.width, highestRes.height);
      }
    } catch (error) {
      setError({
        code: "IMAGE_LOAD_FAILED",
        message: "Failed to load images",
        details: error instanceof Error ? error.message : "Unknown error",
        recoverable: true,
      });
    }
  };

  const handleClear = () => {
    // Revoke all object URLs to prevent memory leaks
    images.forEach((img) => URL.revokeObjectURL(img.url));
    clearImages();
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
        Images <span className="text-red-500">*</span>
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Upload images for your video slideshow (JPEG, PNG, WebP)
      </p>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload image files"
        />

        <button
          onClick={handleClick}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors",
            "bg-blue-600 text-white hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          Choose Images
        </button>

        {images.length > 0 && (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {images.length} {images.length === 1 ? "image" : "images"} selected
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click preview below to reorder
              </p>
            </div>
            <button
              onClick={handleClear}
              className={cn(
                "px-3 py-1 text-sm rounded-md",
                "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                "focus:outline-none focus:ring-2 focus:ring-red-500"
              )}
              aria-label="Clear all images"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
