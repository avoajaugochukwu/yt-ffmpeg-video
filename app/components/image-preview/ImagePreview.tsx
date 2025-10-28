"use client";

/**
 * Image preview component
 * Displays uploaded images in a grid with reordering capability
 */

import { useState } from "react";
import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";

export function ImagePreview() {
  const images = useAppStore((state) => state.files.images);
  const removeImage = useAppStore((state) => state.removeImage);
  const reorderImages = useAppStore((state) => state.reorderImages);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    reorderImages(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Image Preview ({images.length})
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Drag to reorder
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image.name}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative group cursor-move rounded-lg overflow-hidden",
              "border-2 border-gray-200 dark:border-gray-700",
              "hover:border-blue-400 dark:hover:border-blue-600",
              "transition-all duration-200",
              draggedIndex === index && "opacity-50 scale-95"
            )}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Order badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              #{index + 1}
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeImage(index)}
              className={cn(
                "absolute top-2 right-2",
                "bg-red-500 hover:bg-red-600 text-white",
                "w-6 h-6 rounded-full",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200",
                "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              )}
              aria-label={`Remove ${image.name}`}
            >
              ×
            </button>

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-xs text-white truncate">{image.name}</p>
              <p className="text-xs text-gray-300">
                {image.width} × {image.height}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
