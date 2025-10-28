"use client";

/**
 * Action buttons component
 * Generate, Download, and Reset buttons for video creation workflow
 */

import { useAppStore } from "../../store";
import { cn } from "../../lib/utils/cn";

interface ActionButtonsProps {
  onGenerate: () => void;
}

export function ActionButtons({ onGenerate }: ActionButtonsProps) {
  const canGenerate = useAppStore((state) => state.canGenerate());
  const processingState = useAppStore((state) => state.processing.state);
  const generatedVideoUrl = useAppStore((state) => state.generatedVideoUrl);
  const reset = useAppStore((state) => state.reset);

  const isProcessing = processingState === "processing";
  const isCompleted = processingState === "completed";

  const handleDownload = () => {
    if (!generatedVideoUrl) return;

    const link = document.createElement("a");
    link.href = generatedVideoUrl;
    link.download = `video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (
      isProcessing ||
      confirm("Are you sure you want to reset? All current progress will be lost.")
    ) {
      return;
    }
    reset();
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate || isProcessing}
        className={cn(
          "px-6 py-3 rounded-lg font-semibold transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          canGenerate && !isProcessing
            ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500",
          isProcessing && "animate-pulse"
        )}
        aria-label="Generate video"
      >
        {isProcessing ? "Generating..." : "Generate Video"}
      </button>

      {/* Download Button */}
      {isCompleted && generatedVideoUrl && (
        <button
          onClick={handleDownload}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-all",
            "bg-blue-600 text-white hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
          aria-label="Download video"
        >
          Download Video
        </button>
      )}

      {/* Reset Button */}
      {(isCompleted || processingState === "error") && (
        <button
          onClick={handleReset}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-all",
            "bg-gray-600 text-white hover:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          )}
          aria-label="Reset and start over"
        >
          Start Over
        </button>
      )}
    </div>
  );
}
