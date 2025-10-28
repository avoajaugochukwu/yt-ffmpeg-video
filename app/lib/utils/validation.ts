/**
 * File validation utilities
 */

import {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  ErrorCode,
  type ValidationResult,
  type AppError,
} from "../../types";

// File size limits (in bytes)
// Note: These are generous limits for internal use on machines with 8GB+ RAM
const MAX_AUDIO_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_IMAGE_FILE_SIZE = 20 * 1024 * 1024; // 20MB per image

/**
 * Validates an audio file
 */
export function validateAudioFile(file: File): ValidationResult {
  // Check file type
  if (!SUPPORTED_AUDIO_FORMATS.includes(file.type as any)) {
    const error: AppError = {
      code: ErrorCode.INVALID_FILE_TYPE,
      message: `Invalid audio format: ${file.type || "unknown"}`,
      details: `Supported formats: MP3, WAV, AAC, M4A`,
      recoverable: true,
    };
    return { valid: false, error };
  }

  // Check file size
  if (file.size > MAX_AUDIO_FILE_SIZE) {
    const error: AppError = {
      code: ErrorCode.FILE_TOO_LARGE,
      message: `Audio file is too large: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
      details: `Maximum allowed size is ${MAX_AUDIO_FILE_SIZE / 1024 / 1024}MB`,
      recoverable: true,
    };
    return { valid: false, error };
  }

  return { valid: true };
}

/**
 * Validates an image file
 */
export function validateImageFile(file: File): ValidationResult {
  // Check file type
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type as any)) {
    const error: AppError = {
      code: ErrorCode.INVALID_FILE_TYPE,
      message: `Invalid image format: ${file.type || "unknown"}`,
      details: `Supported formats: JPEG, PNG, WebP`,
      recoverable: true,
    };
    return { valid: false, error };
  }

  // Check file size
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    const error: AppError = {
      code: ErrorCode.FILE_TOO_LARGE,
      message: `Image file is too large: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
      details: `Maximum allowed size per image is ${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB`,
      recoverable: true,
    };
    return { valid: false, error };
  }

  return { valid: true };
}

/**
 * Validates multiple image files at once
 */
export function validateImageFiles(files: File[]): {
  valid: boolean;
  validFiles: File[];
  errors: Array<{ file: File; error: AppError }>;
} {
  const validFiles: File[] = [];
  const errors: Array<{ file: File; error: AppError }> = [];

  files.forEach((file) => {
    const result = validateImageFile(file);
    if (result.valid) {
      validFiles.push(file);
    } else if (result.error) {
      errors.push({ file, error: result.error });
    }
  });

  return {
    valid: errors.length === 0,
    validFiles,
    errors,
  };
}

/**
 * Checks if the browser supports required features
 */
export function checkBrowserSupport(): ValidationResult {
  // Check for File API support
  if (typeof File === "undefined" || typeof FileReader === "undefined") {
    const error: AppError = {
      code: ErrorCode.BROWSER_NOT_SUPPORTED,
      message: "Your browser does not support file uploads",
      details: "Please use a modern browser like Chrome, Firefox, Safari, or Edge",
      recoverable: false,
    };
    return { valid: false, error };
  }

  // Check for WebAssembly support (required for FFMPEG)
  if (typeof WebAssembly === "undefined") {
    const error: AppError = {
      code: ErrorCode.BROWSER_NOT_SUPPORTED,
      message: "Your browser does not support WebAssembly",
      details:
        "WebAssembly is required for video processing. Please update your browser.",
      recoverable: false,
    };
    return { valid: false, error };
  }

  // Check for SharedArrayBuffer support (required for FFMPEG)
  if (typeof SharedArrayBuffer === "undefined") {
    const error: AppError = {
      code: ErrorCode.BROWSER_NOT_SUPPORTED,
      message: "Your browser does not support SharedArrayBuffer",
      details:
        "This feature is required for video processing. Try enabling it in browser settings or use a different browser.",
      recoverable: false,
    };
    return { valid: false, error };
  }

  return { valid: true };
}
