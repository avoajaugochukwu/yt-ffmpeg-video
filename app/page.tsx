"use client";

/**
 * YouTube Video Creator - Main Application Page
 * Client-side video generation from images and audio
 */

import { useEffect } from "react";
import { PrimaryAudioInput } from "./components/file-inputs/PrimaryAudioInput";
import { BackgroundMusicInput } from "./components/file-inputs/BackgroundMusicInput";
import { ImageFolderInput } from "./components/file-inputs/ImageFolderInput";
import { ImagePreview } from "./components/image-preview/ImagePreview";
import { TransitionSelector } from "./components/controls/TransitionSelector";
import { VolumeSlider } from "./components/controls/VolumeSlider";
import { ActionButtons } from "./components/controls/ActionButtons";
import { ProgressBar } from "./components/progress/ProgressBar";
import { ErrorDisplay } from "./components/progress/ErrorDisplay";
import { useAppStore } from "./store";
import { generateVideo } from "./lib/video/generator";
import { checkBrowserSupport } from "./lib/utils/validation";

export default function Home() {
  const files = useAppStore((state) => state.files);
  const settings = useAppStore((state) => state.settings);
  const setProcessingState = useAppStore((state) => state.setProcessingState);
  const setProgress = useAppStore((state) => state.setProgress);
  const setError = useAppStore((state) => state.setError);
  const setGeneratedVideoUrl = useAppStore((state) => state.setGeneratedVideoUrl);

  // Check browser support on mount
  useEffect(() => {
    const result = checkBrowserSupport();
    if (!result.valid && result.error) {
      setError(result.error);
    }
  }, [setError]);

  // Prevent accidental tab close during processing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const processing = useAppStore.getState().processing.state;
      if (processing === "processing") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleGenerate = async () => {
    if (!files.primaryAudio || files.images.length === 0 || !settings.outputResolution) {
      return;
    }

    try {
      setProcessingState("processing");
      setError(null);

      const videoUrl = await generateVideo({
        primaryAudio: files.primaryAudio,
        backgroundMusic: files.backgroundMusic,
        images: files.images,
        transitionType: settings.transitionType,
        backgroundMusicVolume: settings.backgroundMusicVolume,
        outputResolution: settings.outputResolution,
        onProgress: (percentage, step) => {
          setProgress({
            percentage,
            currentStep: step,
            substate: "rendering_video",
          });
        },
      });

      setGeneratedVideoUrl(videoUrl);
      setProcessingState("completed");
    } catch (error: any) {
      setProcessingState("error");
      setError(
        error || {
          code: "UNKNOWN_ERROR",
          message: "An unknown error occurred",
          recoverable: true,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            YouTube Video Creator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create videos from images and audio - 100% client-side processing
          </p>
        </header>

        {/* Error Display */}
        <ErrorDisplay />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column: File Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Upload Files
              </h2>
              <PrimaryAudioInput />
              <BackgroundMusicInput />
              <ImageFolderInput />
            </section>

            {/* Image Preview Section */}
            {files.images.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <ImagePreview />
              </section>
            )}

            {/* Progress Section */}
            <ProgressBar />
          </div>

          {/* Right Column: Settings & Actions */}
          <div className="space-y-6">
            {/* Settings Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <TransitionSelector />
              <VolumeSlider />

              {/* Output Resolution Display */}
              {settings.outputResolution && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Output Resolution
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {settings.outputResolution.width} × {settings.outputResolution.height}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-detected from images
                  </p>
                </div>
              )}
            </section>

            {/* Action Buttons Section */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Actions
              </h2>
              <ActionButtons onGenerate={handleGenerate} />
            </section>

            {/* Info Section */}
            <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                How it works
              </h3>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Upload your primary audio and images</li>
                <li>• Optionally add background music</li>
                <li>• Choose a transition effect</li>
                <li>• Click "Generate Video"</li>
                <li>• Wait for processing (100% in your browser)</li>
                <li>• Download your video!</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
