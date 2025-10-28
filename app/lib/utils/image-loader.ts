/**
 * Image loading and metadata extraction utilities
 */

import type { ImageFile } from "../../types";

/**
 * Loads an image file and extracts its metadata
 * @param file - The image file to load
 * @param order - The display order for this image
 * @returns Promise resolving to ImageFile with metadata
 */
export async function loadImageWithMetadata(file: File, order: number): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        file,
        name: file.name,
        url,
        width: img.width,
        height: img.height,
        order,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Loads multiple image files with metadata
 * @param files - Array of image files to load
 * @param startOrder - Starting order number for the first image
 * @returns Promise resolving to array of ImageFile objects
 */
export async function loadImagesWithMetadata(
  files: File[],
  startOrder = 0
): Promise<ImageFile[]> {
  const promises = files.map((file, index) =>
    loadImageWithMetadata(file, startOrder + index)
  );
  return Promise.all(promises);
}

/**
 * Finds the highest resolution among a set of images
 * @param images - Array of ImageFile objects
 * @returns Object with width and height of highest resolution, or null if no images
 */
export function findHighestResolution(
  images: ImageFile[]
): { width: number; height: number } | null {
  if (images.length === 0) return null;

  let maxWidth = 0;
  let maxHeight = 0;

  images.forEach((img) => {
    if (img.width > maxWidth) {
      maxWidth = img.width;
      maxHeight = img.height;
    } else if (img.width === maxWidth && img.height > maxHeight) {
      maxHeight = img.height;
    }
  });

  return { width: maxWidth, height: maxHeight };
}

/**
 * Sorts image files intelligently (numerical sequences first, then alphabetical)
 * @param images - Array of ImageFile objects to sort
 * @returns Sorted array of ImageFile objects
 */
export function sortImagesIntelligently(images: ImageFile[]): ImageFile[] {
  return [...images].sort((a, b) => {
    // Extract numeric sequences from filenames
    const aNumbers = a.name.match(/\d+/g);
    const bNumbers = b.name.match(/\d+/g);

    // If both have numbers, compare numerically
    if (aNumbers && bNumbers) {
      for (let i = 0; i < Math.min(aNumbers.length, bNumbers.length); i++) {
        const aNum = parseInt(aNumbers[i], 10);
        const bNum = parseInt(bNumbers[i], 10);
        if (aNum !== bNum) {
          return aNum - bNum;
        }
      }
      // If all numbers are equal, fall through to alphabetical comparison
    }

    // If only one has numbers, it comes first
    if (aNumbers && !bNumbers) return -1;
    if (!aNumbers && bNumbers) return 1;

    // Otherwise, sort alphabetically (case-insensitive)
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}
