/**
 * Audio duration and timing utilities
 */

/**
 * Gets the duration of an audio file in seconds
 * @param file - The audio file to analyze
 * @returns Promise resolving to duration in seconds
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load audio file: ${file.name}`));
    };

    audio.src = url;
  });
}

/**
 * Calculates per-image display duration
 * @param totalDuration - Total audio duration in seconds
 * @param imageCount - Number of images
 * @returns Duration per image in seconds
 */
export function calculateImageDuration(totalDuration: number, imageCount: number): number {
  if (imageCount <= 0) {
    throw new Error("Image count must be greater than 0");
  }
  return totalDuration / imageCount;
}

/**
 * Calculates timing information for each image
 * @param totalDuration - Total audio duration in seconds
 * @param imageCount - Number of images
 * @returns Array of timing objects with start and end times for each image
 */
export function calculateImageTimings(
  totalDuration: number,
  imageCount: number
): Array<{ index: number; start: number; end: number; duration: number }> {
  const imageDuration = calculateImageDuration(totalDuration, imageCount);
  const timings = [];

  for (let i = 0; i < imageCount; i++) {
    const start = i * imageDuration;
    const end = (i + 1) * imageDuration;
    timings.push({
      index: i,
      start,
      end,
      duration: imageDuration,
    });
  }

  return timings;
}

/**
 * Formats duration in seconds to HH:MM:SS or MM:SS format
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
