/**
 * Video generation pipeline using FFMPEG.wasm
 */

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { ImageFile, TransitionType, AppError } from "../../types";
import { ErrorCode } from "../../types";
import { getAudioDuration, calculateImageDuration } from "../audio/duration";
import { buildTransitionFilterComplex } from "../ffmpeg/transitions";
import { initializeFFmpeg } from "../ffmpeg/init";

/**
 * Progress callback type
 */
export type ProgressCallback = (percentage: number, step: string) => void;

/**
 * Video generation options
 */
export interface VideoGenerationOptions {
  primaryAudio: File;
  backgroundMusic: File | null;
  images: ImageFile[];
  transitionType: TransitionType;
  backgroundMusicVolume: number; // 0-50
  outputResolution: { width: number; height: number };
  onProgress?: ProgressCallback;
}

/**
 * Generates a video from images and audio using FFMPEG.wasm
 * @param options - Video generation options
 * @returns Promise resolving to video Blob URL
 */
export async function generateVideo(options: VideoGenerationOptions): Promise<string> {
  const {
    primaryAudio,
    backgroundMusic,
    images,
    transitionType,
    backgroundMusicVolume,
    outputResolution,
    onProgress,
  } = options;

  try {
    // Step 1: Initialize FFMPEG
    onProgress?.(5, "Initializing video processor...");
    const ffmpeg = await initializeFFmpeg();

    // Step 2: Load audio duration
    onProgress?.(10, "Analyzing audio...");
    const audioDuration = await getAudioDuration(primaryAudio);
    const imageDuration = calculateImageDuration(audioDuration, images.length);

    // Step 3: Write files to FFMPEG virtual filesystem
    onProgress?.(15, "Loading files...");
    await writeFilesToFFmpeg(ffmpeg, primaryAudio, backgroundMusic, images);

    // Step 4: Generate video from images
    onProgress?.(30, "Creating image slideshow...");
    await generateImageVideo(
      ffmpeg,
      images,
      imageDuration,
      transitionType,
      outputResolution,
      audioDuration
    );

    // Step 5: Mix audio tracks
    onProgress?.(60, "Mixing audio...");
    await mixAudioTracks(ffmpeg, primaryAudio, backgroundMusic, backgroundMusicVolume);

    // Step 6: Combine video and audio
    onProgress?.(80, "Finalizing video...");
    await combineVideoAndAudio(ffmpeg);

    // Step 7: Read output file
    onProgress?.(95, "Preparing download...");
    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data as BlobPart], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    // Step 8: Cleanup
    onProgress?.(100, "Complete!");
    await cleanupFFmpegFiles(ffmpeg);

    return url;
  } catch (error) {
    const appError: AppError = {
      code: ErrorCode.FFMPEG_PROCESSING_FAILED,
      message: "Video generation failed",
      details: error instanceof Error ? error.message : "Unknown error occurred",
      recoverable: true,
    };
    throw appError;
  }
}

/**
 * Writes all files to FFMPEG virtual filesystem
 */
async function writeFilesToFFmpeg(
  ffmpeg: FFmpeg,
  primaryAudio: File,
  backgroundMusic: File | null,
  images: ImageFile[]
): Promise<void> {
  // Write primary audio
  await ffmpeg.writeFile("primary_audio.mp3", await fetchFile(primaryAudio));

  // Write background music if provided
  if (backgroundMusic) {
    await ffmpeg.writeFile("background_music.mp3", await fetchFile(backgroundMusic));
  }

  // Write all images
  for (let i = 0; i < images.length; i++) {
    const ext = images[i].name.split(".").pop() || "jpg";
    await ffmpeg.writeFile(`image_${i}.${ext}`, await fetchFile(images[i].file));
  }
}

/**
 * Generates video from images with transitions
 */
async function generateImageVideo(
  ffmpeg: FFmpeg,
  images: ImageFile[],
  imageDuration: number,
  transitionType: TransitionType,
  resolution: { width: number; height: number },
  totalDuration: number
): Promise<void> {
  const { width, height } = resolution;

  if (images.length === 1) {
    // Single image - no transitions needed
    const ext = images[0].name.split(".").pop() || "jpg";
    await ffmpeg.exec([
      "-loop",
      "1",
      "-i",
      `image_0.${ext}`,
      "-t",
      totalDuration.toString(),
      "-vf",
      `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      "-pix_fmt",
      "yuv420p",
      "video_only.mp4",
    ]);
  } else {
    // Multiple images with transitions
    const inputs: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const ext = images[i].name.split(".").pop() || "jpg";
      inputs.push("-loop", "1", "-t", imageDuration.toString(), "-i", `image_${i}.${ext}`);
    }

    const filterComplex = buildTransitionFilterComplex(
      images.length,
      imageDuration,
      transitionType
    );

    await ffmpeg.exec([
      ...inputs,
      "-filter_complex",
      filterComplex,
      "-map",
      "[vout]",
      "-pix_fmt",
      "yuv420p",
      "-t",
      totalDuration.toString(),
      "video_only.mp4",
    ]);
  }
}

/**
 * Mixes audio tracks with volume adjustment
 */
async function mixAudioTracks(
  ffmpeg: FFmpeg,
  primaryAudio: File,
  backgroundMusic: File | null,
  backgroundVolume: number
): Promise<void> {
  if (!backgroundMusic) {
    // No background music, just copy primary audio
    await ffmpeg.exec(["-i", "primary_audio.mp3", "-c", "copy", "audio_mixed.mp3"]);
  } else {
    // Mix primary and background audio with volume adjustment
    const bgVolumeDecimal = backgroundVolume / 100;
    await ffmpeg.exec([
      "-i",
      "primary_audio.mp3",
      "-i",
      "background_music.mp3",
      "-filter_complex",
      `[1:a]volume=${bgVolumeDecimal},aloop=loop=-1:size=2e+09[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2`,
      "audio_mixed.mp3",
    ]);
  }
}

/**
 * Combines video and audio into final output
 */
async function combineVideoAndAudio(ffmpeg: FFmpeg): Promise<void> {
  await ffmpeg.exec([
    "-i",
    "video_only.mp4",
    "-i",
    "audio_mixed.mp3",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-strict",
    "experimental",
    "output.mp4",
  ]);
}

/**
 * Cleans up temporary files from FFMPEG filesystem
 */
async function cleanupFFmpegFiles(ffmpeg: FFmpeg): Promise<void> {
  try {
    const files = ["video_only.mp4", "audio_mixed.mp3"];
    for (const file of files) {
      try {
        await ffmpeg.deleteFile(file);
      } catch (e) {
        // Ignore errors for individual file deletions
      }
    }
  } catch (error) {
    console.warn("Error cleaning up FFMPEG files:", error);
  }
}
