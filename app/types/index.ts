/**
 * Application-wide TypeScript type definitions
 */

/**
 * Transition effects available for video generation
 */
export type TransitionType = "fade" | "fadeToBlack" | "wipeLeft" | "wipeUp";

/**
 * Processing states for the video generation workflow
 */
export type ProcessingState = "idle" | "processing" | "completed" | "error";

/**
 * Processing substates to provide detailed feedback
 */
export type ProcessingSubstate =
  | "loading_ffmpeg"
  | "analyzing_files"
  | "mixing_audio"
  | "rendering_video"
  | "finalizing";

/**
 * Represents an uploaded image file with metadata
 */
export interface ImageFile {
  file: File;
  name: string;
  url: string; // Object URL for preview
  width: number;
  height: number;
  order: number; // For sorting/reordering
}

/**
 * User configuration settings for video generation
 */
export interface VideoSettings {
  transitionType: TransitionType;
  backgroundMusicVolume: number; // 0-50 (percentage)
  outputResolution: {
    width: number;
    height: number;
  } | null; // Auto-detected from highest resolution image
}

/**
 * Progress information during video generation
 */
export interface ProgressInfo {
  percentage: number; // 0-100
  currentStep: string; // Human-readable description
  substate: ProcessingSubstate;
  estimatedTimeRemaining?: number; // in seconds, optional
}

/**
 * Error information with user-friendly messages
 */
export interface AppError {
  code: string;
  message: string;
  details?: string;
  recoverable: boolean;
}

/**
 * File upload state for audio and images
 */
export interface FileState {
  primaryAudio: File | null;
  backgroundMusic: File | null;
  images: ImageFile[];
}

/**
 * Complete application state structure
 */
export interface AppState {
  // File management
  files: FileState;

  // User settings
  settings: VideoSettings;

  // Processing state
  processing: {
    state: ProcessingState;
    progress: ProgressInfo | null;
    error: AppError | null;
  };

  // Output
  generatedVideoUrl: string | null;
}

/**
 * Supported audio file formats
 */
export const SUPPORTED_AUDIO_FORMATS = [
  "audio/mpeg", // MP3
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/aac",
  "audio/x-aac",
  "audio/m4a",
  "audio/x-m4a",
] as const;

/**
 * Supported image file formats
 */
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/**
 * Error codes for different failure scenarios
 */
export enum ErrorCode {
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  OUT_OF_MEMORY = "OUT_OF_MEMORY",
  FFMPEG_INIT_FAILED = "FFMPEG_INIT_FAILED",
  FFMPEG_PROCESSING_FAILED = "FFMPEG_PROCESSING_FAILED",
  AUDIO_LOAD_FAILED = "AUDIO_LOAD_FAILED",
  IMAGE_LOAD_FAILED = "IMAGE_LOAD_FAILED",
  INSUFFICIENT_FILES = "INSUFFICIENT_FILES",
  BROWSER_NOT_SUPPORTED = "BROWSER_NOT_SUPPORTED",
}

/**
 * Transition effect configuration for FFMPEG
 */
export interface TransitionConfig {
  name: TransitionType;
  displayName: string;
  description: string;
  ffmpegFilter: (duration: number) => string;
}

/**
 * Validation result for file uploads
 */
export interface ValidationResult {
  valid: boolean;
  error?: AppError;
}
