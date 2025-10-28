/**
 * Global application state management using Zustand
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  AppState,
  ImageFile,
  TransitionType,
  ProcessingState,
  ProgressInfo,
  AppError,
} from "../types";

/**
 * Actions available for state mutations
 */
interface AppActions {
  // File management actions
  setPrimaryAudio: (file: File | null) => void;
  setBackgroundMusic: (file: File | null) => void;
  addImages: (images: ImageFile[]) => void;
  removeImage: (index: number) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
  clearImages: () => void;

  // Settings actions
  setTransitionType: (type: TransitionType) => void;
  setBackgroundMusicVolume: (volume: number) => void;
  setOutputResolution: (width: number, height: number) => void;

  // Processing actions
  setProcessingState: (state: ProcessingState) => void;
  setProgress: (progress: ProgressInfo | null) => void;
  setError: (error: AppError | null) => void;

  // Output actions
  setGeneratedVideoUrl: (url: string | null) => void;

  // Utility actions
  reset: () => void;
  canGenerate: () => boolean;
}

/**
 * Combined store type
 */
type AppStore = AppState & AppActions;

/**
 * Initial state
 */
const initialState: AppState = {
  files: {
    primaryAudio: null,
    backgroundMusic: null,
    images: [],
  },
  settings: {
    transitionType: "fade",
    backgroundMusicVolume: 25, // Default 25%
    outputResolution: null,
  },
  processing: {
    state: "idle",
    progress: null,
    error: null,
  },
  generatedVideoUrl: null,
};

/**
 * Main application store
 */
export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // File management actions
      setPrimaryAudio: (file) =>
        set(
          (state) => ({
            files: { ...state.files, primaryAudio: file },
          }),
          false,
          "setPrimaryAudio"
        ),

      setBackgroundMusic: (file) =>
        set(
          (state) => ({
            files: { ...state.files, backgroundMusic: file },
          }),
          false,
          "setBackgroundMusic"
        ),

      addImages: (images) =>
        set(
          (state) => ({
            files: {
              ...state.files,
              images: [...state.files.images, ...images],
            },
          }),
          false,
          "addImages"
        ),

      removeImage: (index) =>
        set(
          (state) => ({
            files: {
              ...state.files,
              images: state.files.images.filter((_, i) => i !== index),
            },
          }),
          false,
          "removeImage"
        ),

      reorderImages: (startIndex, endIndex) =>
        set(
          (state) => {
            const images = [...state.files.images];
            const [removed] = images.splice(startIndex, 1);
            images.splice(endIndex, 0, removed);
            // Update order property
            const reordered = images.map((img, idx) => ({ ...img, order: idx }));
            return {
              files: { ...state.files, images: reordered },
            };
          },
          false,
          "reorderImages"
        ),

      clearImages: () =>
        set(
          (state) => ({
            files: { ...state.files, images: [] },
          }),
          false,
          "clearImages"
        ),

      // Settings actions
      setTransitionType: (type) =>
        set(
          (state) => ({
            settings: { ...state.settings, transitionType: type },
          }),
          false,
          "setTransitionType"
        ),

      setBackgroundMusicVolume: (volume) =>
        set(
          (state) => ({
            settings: { ...state.settings, backgroundMusicVolume: volume },
          }),
          false,
          "setBackgroundMusicVolume"
        ),

      setOutputResolution: (width, height) =>
        set(
          (state) => ({
            settings: {
              ...state.settings,
              outputResolution: { width, height },
            },
          }),
          false,
          "setOutputResolution"
        ),

      // Processing actions
      setProcessingState: (processingState) =>
        set(
          (state) => ({
            processing: { ...state.processing, state: processingState },
          }),
          false,
          "setProcessingState"
        ),

      setProgress: (progress) =>
        set(
          (state) => ({
            processing: { ...state.processing, progress },
          }),
          false,
          "setProgress"
        ),

      setError: (error) =>
        set(
          (state) => ({
            processing: { ...state.processing, error },
          }),
          false,
          "setError"
        ),

      // Output actions
      setGeneratedVideoUrl: (url) =>
        set({ generatedVideoUrl: url }, false, "setGeneratedVideoUrl"),

      // Utility actions
      reset: () =>
        set(
          (state) => {
            // Clean up object URLs to prevent memory leaks
            state.files.images.forEach((img) => URL.revokeObjectURL(img.url));
            if (state.generatedVideoUrl) {
              URL.revokeObjectURL(state.generatedVideoUrl);
            }
            return initialState;
          },
          false,
          "reset"
        ),

      canGenerate: () => {
        const state = get();
        return (
          state.files.primaryAudio !== null &&
          state.files.images.length > 0 &&
          state.processing.state !== "processing"
        );
      },
    }),
    { name: "YT Video Creator Store" }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useFiles = () => useAppStore((state) => state.files);
export const useSettings = () => useAppStore((state) => state.settings);
export const useProcessing = () => useAppStore((state) => state.processing);
export const useGeneratedVideoUrl = () => useAppStore((state) => state.generatedVideoUrl);
export const useCanGenerate = () => useAppStore((state) => state.canGenerate());
