# Product Requirements Document: yt-video-creator

**Version:** 2.0
**Date:** October 26, 2023
**Status:** Confirmed Requirements

---

## 1. Overview & Vision

**yt-video-creator** is a web application, built with Next.js, that empowers users to create videos directly in their web browser. By leveraging the power of FFMPEG compiled to WebAssembly (FFMPEG.wasm), the app performs all media processing locally on the user's machine. This "serverless" approach ensures 100% privacy—user files are never uploaded—and provides a seamless experience for creating simple, elegant videos from audio, images, and music without any specialized software.

---

## 2. Goals & Objectives

### Primary Goal
To provide a simple, accessible, web-based tool for creating videos from audio and images.

### Key Objectives
- To perform all video processing entirely within the user's web browser.
- To eliminate the need for file uploads to a remote server.
- To give users control over visual transitions and audio mixing.
- To automatically synchronize image display duration with the primary audio track's length.
- To deliver a final, ready-to-use video file directly to the user for download.

---

## 3. User Persona

**"The Casual Content Creator"** (e.g., a podcaster, teacher, or marketer) who needs a fast, private way to convert audio content into a shareable video format.

---

## 4. Functional Requirements (User Stories)

### 4.1. File Input & Management

- **As a user**, I want a clear UI to select my local files: one Primary Audio file, one Background Music file (optional), and a folder containing all my Image files.
- **As a user**, I want the application to intelligently sort the images from the uploaded folder. It will first look for numerical sequences in the filenames (e.g., `img_001.png`, `002.jpg`) for primary sorting. Any remaining images will be sorted alphabetically.
- **As a user**, I want to see a preview of my sorted images in the correct order.

### 4.2. Configuration & Settings

- **As a user**, I want to select a video transition style from a dropdown list. The list should include gentle options like:
  - Fade (Cross-dissolve)
  - Fade to Black
  - Wipe Left-to-Right
  - Wipe Up-to-Down
- **As a user**, I want a slider to adjust the volume of the Background Music. The slider will range from 0% (mute) to 50% (half of original volume) to prevent overpowering the Primary Audio.
- **As a user**, I want the application to automatically set the output video resolution to match the highest resolution among the uploaded images.

### 4.3. Audio & Video Processing Logic

- **As the application**, I will measure the duration of the Primary Audio file to determine the total video length.
- **As the application**, I will count the number of images and calculate an equal display duration for each one to fit the total video length.
- **As the application**, I will prepare the background music by looping it if necessary and applying the volume level set by the user's slider.
- **As the application**, I will mix the Primary Audio and the processed Background Music.
- **As the application**, I will generate a video slideshow using the sorted images, their calculated durations, and the user-selected transition effect.
- **As the application**, I will combine the final audio and video streams into a single `.mp4` video file.

### 4.4. User Interface & Experience

- **As a user**, I want a single "Generate Video" button that is enabled only after a Primary Audio file and at least one Image file are selected.
- **As a user**, I want to see a clear progress indicator (percentage, status text like "Mixing Audio...", "Rendering Video...") while the video is being generated in my browser.
- **As a user**, I want the browser tab to remain responsive, and I should be warned not to close it during the generation process.
- **As a user**, I want a "Download Video" button to appear automatically once the process is complete, allowing me to save the final `.mp4` file.
- **As a user**, I want to see simple, clear error messages if something goes wrong (e.g., "Invalid file type," "Processing failed due to insufficient memory").

---

## 5. Technical Architecture & Stack

### Frontend & Hosting
Next.js deployed on Vercel. The application will be a Single Page Application (SPA) where all logic resides on the client-side.

### Core Engine
FFMPEG.wasm. This is a WebAssembly port of FFMPEG that runs directly in the browser. The application will load this library and interact with it via JavaScript.

### State Management
A robust state management library (e.g., React Context, Zustand, or Redux Toolkit) to handle file states, user settings, and processing progress.

### In-Browser Workflow

1. User navigates to the application URL hosted on Vercel.
2. The browser downloads the Next.js application bundle, including the FFMPEG.wasm library.
3. User selects files using the browser's file input. These files are loaded into the browser's memory using the File API. They are never uploaded to Vercel's servers.
4. The React UI constructs a complex FFMPEG command string based on all user inputs (file data, transition choice, audio volume, etc.).
5. The FFMPEG.wasm library is invoked with this command. It creates a virtual filesystem in memory, processes the files, and executes the rendering job.
6. The library emits progress events, which are captured by the UI to update the progress bar.
7. Upon completion, the final video exists as a data buffer (e.g., a Blob) in the browser's memory.
8. The UI creates an object URL (`URL.createObjectURL()`) for this Blob and attaches it to a download link, allowing the user to save their video.

---

## 6. Non-Functional Requirements & Constraints

### Performance
The video generation speed is entirely dependent on the user's computer (CPU and available RAM). Slower machines will have longer processing times.

### Browser Compatibility
The application will require a modern browser (latest versions of Chrome, Firefox, Edge, Safari) that supports WebAssembly and has sufficient memory allocation per tab.

### Memory Limitations
Since all processing and file storage happens in the browser's RAM, there is a practical limit to the size and number of files that can be processed. The application should handle potential "Out of Memory" errors gracefully.

### No Backend State
The application is entirely client-side. If the user refreshes the page, their session and selected files will be lost.

---

## 7. Success Metrics

- User successfully generates a video on first attempt without errors
- Processing time remains reasonable for typical use cases (3-5 minute audio with 5-10 images)
- Zero file uploads to servers (100% client-side processing)
- Clear user feedback throughout the video generation process

---

## 8. Future Considerations

- Text overlay support for images
- Custom timing per image
- Additional transition effects
- Video export quality settings
- Progress save/restore functionality
