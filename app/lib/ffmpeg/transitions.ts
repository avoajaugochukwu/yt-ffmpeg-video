/**
 * Transition effects for FFMPEG
 */

import type { TransitionType, TransitionConfig } from "../../types";

/**
 * Transition duration in seconds
 */
const TRANSITION_DURATION = 1.0;

/**
 * Generates FFMPEG filter for fade (cross-dissolve) transition
 * @param duration - Duration of the fade in seconds
 * @param offset - Time offset when transition should start
 * @returns FFMPEG filter string
 */
function getFadeFilter(duration: number = TRANSITION_DURATION, offset: number = 0): string {
  // xfade filter for crossfade between images
  return `xfade=transition=fade:duration=${duration}:offset=${offset}`;
}

/**
 * Generates FFMPEG filter for fade to black transition
 * @param duration - Duration of the fade in seconds
 * @param offset - Time offset when transition should start
 * @returns FFMPEG filter string
 */
function getFadeToBlackFilter(duration: number = TRANSITION_DURATION, offset: number = 0): string {
  // Fade out to black, then fade in from black
  return `xfade=transition=fadeblack:duration=${duration}:offset=${offset}`;
}

/**
 * Generates FFMPEG filter for wipe left-to-right transition
 * @param duration - Duration of the wipe in seconds
 * @param offset - Time offset when transition should start
 * @returns FFMPEG filter string
 */
function getWipeLeftFilter(duration: number = TRANSITION_DURATION, offset: number = 0): string {
  // Horizontal wipe from left to right
  return `xfade=transition=wiperight:duration=${duration}:offset=${offset}`;
}

/**
 * Generates FFMPEG filter for wipe up-to-down transition
 * @param duration - Duration of the wipe in seconds
 * @param offset - Time offset when transition should start
 * @returns FFMPEG filter string
 */
function getWipeUpFilter(duration: number = TRANSITION_DURATION, offset: number = 0): string {
  // Vertical wipe from top to bottom
  return `xfade=transition=wipedown:duration=${duration}:offset=${offset}`;
}

/**
 * Transition configurations
 */
export const TRANSITION_CONFIGS: Record<TransitionType, TransitionConfig> = {
  fade: {
    name: "fade",
    displayName: "Fade (Cross-dissolve)",
    description: "Smooth crossfade between images",
    ffmpegFilter: getFadeFilter,
  },
  fadeToBlack: {
    name: "fadeToBlack",
    displayName: "Fade to Black",
    description: "Fade out to black, then fade in next image",
    ffmpegFilter: getFadeToBlackFilter,
  },
  wipeLeft: {
    name: "wipeLeft",
    displayName: "Wipe Left-to-Right",
    description: "Next image wipes from left to right",
    ffmpegFilter: getWipeLeftFilter,
  },
  wipeUp: {
    name: "wipeUp",
    displayName: "Wipe Up-to-Down",
    description: "Next image wipes from top to bottom",
    ffmpegFilter: getWipeUpFilter,
  },
};

/**
 * Gets the transition filter for a specific transition type
 * @param transitionType - The type of transition
 * @param duration - Optional custom duration
 * @param offset - Time offset when transition should start
 * @returns FFMPEG filter string
 */
export function getTransitionFilter(
  transitionType: TransitionType,
  duration?: number,
  offset?: number
): string {
  const config = TRANSITION_CONFIGS[transitionType];
  return config.ffmpegFilter(duration || TRANSITION_DURATION, offset || 0);
}

/**
 * Builds a complex filter string for multiple images with transitions
 * @param imageCount - Number of images
 * @param imageDuration - Duration each image is displayed
 * @param transitionType - Type of transition to use
 * @returns FFMPEG filter_complex string
 */
export function buildTransitionFilterComplex(
  imageCount: number,
  imageDuration: number,
  transitionType: TransitionType
): string {
  if (imageCount === 1) {
    // No transitions needed for single image
    return "[0:v]scale=iw:ih[v0]";
  }

  const transitions: string[] = [];

  // Scale all images to the same resolution
  for (let i = 0; i < imageCount; i++) {
    transitions.push(`[${i}:v]scale=iw:ih,setpts=PTS-STARTPTS+${i * imageDuration}/TB[v${i}]`);
  }

  // Create transitions between consecutive images
  // Each transition starts at (imageDuration - transitionDuration) for overlap effect
  let currentStream = "v0";
  for (let i = 0; i < imageCount - 1; i++) {
    const nextStream = i === imageCount - 2 ? "vout" : `vt${i}`;
    // The offset is when the transition should start relative to the first input stream
    // It should start just before the next image appears (imageDuration - TRANSITION_DURATION)
    const offset = imageDuration - TRANSITION_DURATION;
    const transitionFilter = getTransitionFilter(transitionType, TRANSITION_DURATION, offset);
    transitions.push(
      `[${currentStream}][v${i + 1}]${transitionFilter}[${nextStream}]`
    );
    currentStream = nextStream;
  }

  return transitions.join(";");
}
