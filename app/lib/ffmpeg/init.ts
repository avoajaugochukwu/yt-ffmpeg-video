/**
 * FFMPEG.wasm initialization and setup
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import type { AppError } from "../../types";
import { ErrorCode } from "../../types";

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadError: AppError | null = null;

/**
 * Gets or creates the FFmpeg instance
 * @returns The FFmpeg instance
 */
export function getFFmpegInstance(): FFmpeg {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
  }
  return ffmpegInstance;
}

/**
 * Initializes FFmpeg.wasm with progress callback
 * @param onProgress - Optional callback for load progress
 * @returns Promise resolving to initialized FFmpeg instance
 */
export async function initializeFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  // Return existing instance if already loaded
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  // Return error if previous load failed
  if (loadError) {
    throw loadError;
  }

  // Prevent multiple simultaneous loads
  if (isLoading) {
    // Wait for current load to complete
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (!isLoading) {
          clearInterval(checkInterval);
          if (ffmpegInstance && ffmpegInstance.loaded) {
            resolve(ffmpegInstance);
          } else if (loadError) {
            reject(loadError);
          }
        }
      }, 100);
    });
  }

  isLoading = true;

  try {
    const ffmpeg = getFFmpegInstance();

    // Set up progress logging
    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg]", message);
    });

    // Load FFmpeg core
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");

    await ffmpeg.load({
      coreURL,
      wasmURL,
    });

    isLoading = false;
    return ffmpeg;
  } catch (error) {
    isLoading = false;
    loadError = {
      code: ErrorCode.FFMPEG_INIT_FAILED,
      message: "Failed to initialize video processor",
      details: error instanceof Error ? error.message : "Unknown error",
      recoverable: false,
    };
    throw loadError;
  }
}

/**
 * Checks if FFmpeg is loaded and ready
 * @returns True if FFmpeg is loaded
 */
export function isFFmpegLoaded(): boolean {
  return ffmpegInstance !== null && ffmpegInstance.loaded;
}

/**
 * Terminates the FFmpeg instance and cleans up resources
 */
export async function terminateFFmpeg(): Promise<void> {
  if (ffmpegInstance) {
    try {
      await ffmpegInstance.terminate();
    } catch (error) {
      console.error("Error terminating FFmpeg:", error);
    }
    ffmpegInstance = null;
    loadError = null;
  }
}
