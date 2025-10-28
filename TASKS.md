# yt-video-creator - Development Task List

Generated from PRD v2.0 - October 26, 2023

---

## Phase 1: Project Setup & Dependencies

- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Next.js for client-side only (SPA mode)
- [ ] Install FFMPEG.wasm library (`@ffmpeg/ffmpeg`, `@ffmpeg/util`)
- [ ] Set up state management library (Zustand/Redux Toolkit/React Context)
- [ ] Configure Vercel deployment settings
- [ ] Set up ESLint and Prettier for code quality
- [ ] Create basic project structure (components, utils, hooks folders)

---

## Phase 2: UI Components & Layout

### 2.1 File Input Components
- [ ] Create PrimaryAudioInput component (accept audio files)
- [ ] Create BackgroundMusicInput component (optional audio input)
- [ ] Create ImageFolderInput component (accept multiple image files)
- [ ] Add file type validation for inputs
- [ ] Display selected file names and counts

### 2.2 Image Preview & Sorting
- [ ] Implement intelligent image sorting logic (numerical then alphabetical)
  - [ ] Parse filenames for numerical sequences (e.g., `img_001.png`, `002.jpg`)
  - [ ] Sort numerically matched images first
  - [ ] Sort remaining images alphabetically
- [ ] Create ImagePreview component to display sorted images
- [ ] Add drag-and-drop reordering capability (nice-to-have)

### 2.3 Configuration Controls
- [ ] Create TransitionSelector dropdown component with options:
  - [ ] Fade (Cross-dissolve)
  - [ ] Fade to Black
  - [ ] Wipe Left-to-Right
  - [ ] Wipe Up-to-Down
- [ ] Create VolumeSlider component (0% to 50% range)
- [ ] Display current volume percentage value
- [ ] Add auto-detect and display output video resolution

### 2.4 Action Controls
- [ ] Create "Generate Video" button
- [ ] Implement button enable/disable logic (requires primary audio + ≥1 image)
- [ ] Create "Download Video" button (appears after completion)
- [ ] Add "Reset" or "Start Over" functionality

---

## Phase 3: File Management & Processing

### 3.1 File Handling
- [ ] Implement File API integration for reading local files
- [ ] Create utility to load files into browser memory
- [ ] Implement file size validation
- [ ] Add supported file format checking (MP3, WAV, PNG, JPG, etc.)

### 3.2 Image Analysis
- [ ] Create utility to detect image resolutions
- [ ] Implement logic to find highest resolution among images
- [ ] Set output video resolution to match highest image resolution

---

## Phase 4: Audio Processing Logic

### 4.1 Audio Duration & Timing
- [ ] Create utility to measure primary audio duration
- [ ] Calculate per-image display duration (total duration ÷ image count)
- [ ] Handle edge cases (very short/long audio)

### 4.2 Background Music Processing
- [ ] Implement background music looping logic (if shorter than primary audio)
- [ ] Apply volume adjustment based on slider value (0-50%)
- [ ] Mix primary audio with processed background music

---

## Phase 5: FFMPEG.wasm Integration

### 5.1 FFMPEG Setup
- [ ] Initialize FFMPEG.wasm library in browser
- [ ] Create virtual filesystem for file operations
- [ ] Implement file loading into FFMPEG virtual FS

### 5.2 Transition Effects Implementation
- [ ] Implement Fade (Cross-dissolve) transition
- [ ] Implement Fade to Black transition
- [ ] Implement Wipe Left-to-Right transition
- [ ] Implement Wipe Up-to-Down transition
- [ ] Create FFMPEG filter complex commands for each transition

### 5.3 Video Generation Pipeline
- [ ] Build FFMPEG command string constructor
- [ ] Implement image slideshow generation with calculated durations
- [ ] Apply selected transition effects between images
- [ ] Combine audio tracks (primary + background music)
- [ ] Merge video and audio streams into final MP4
- [ ] Set output video codec and quality settings

---

## Phase 6: Progress & Error Handling

### 6.1 Progress Indicators
- [ ] Create ProgressBar component
- [ ] Implement percentage display
- [ ] Add status text display ("Mixing Audio...", "Rendering Video...", etc.)
- [ ] Capture and display FFMPEG progress events
- [ ] Add estimated time remaining (optional)

### 6.2 User Feedback
- [ ] Add warning message: "Do not close tab during processing"
- [ ] Implement browser beforeunload event handler
- [ ] Keep UI responsive during processing
- [ ] Add completion notification/message

### 6.3 Error Handling
- [ ] Create error message display component
- [ ] Handle "Invalid file type" errors
- [ ] Handle "Out of Memory" errors gracefully
- [ ] Handle FFMPEG processing failures
- [ ] Add user-friendly error messages for all error scenarios
- [ ] Implement error logging for debugging

---

## Phase 7: Download & Output

- [ ] Generate video Blob from FFMPEG output
- [ ] Create object URL using `URL.createObjectURL()`
- [ ] Attach URL to download link
- [ ] Set appropriate filename for downloaded video
- [ ] Clean up object URLs after download
- [ ] Verify MP4 file integrity

---

## Phase 8: State Management

- [ ] Define application state schema
  - [ ] File states (primary audio, background music, images)
  - [ ] User settings (transition type, volume level)
  - [ ] Processing state (idle, processing, completed, error)
  - [ ] Progress information
- [ ] Implement state actions/reducers
- [ ] Connect UI components to state
- [ ] Handle state persistence (if needed for session)

---

## Phase 9: Testing & Quality Assurance

### 9.1 Browser Compatibility
- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Edge (latest)
- [ ] Test on Safari (latest)
- [ ] Verify WebAssembly support detection

### 9.2 Functional Testing
- [ ] Test with various audio file formats (MP3, WAV, AAC)
- [ ] Test with various image formats (PNG, JPG, JPEG)
- [ ] Test with different image counts (1, 5, 10, 20+)
- [ ] Test with different audio durations (30s, 3min, 10min)
- [ ] Test all transition effects
- [ ] Test volume slider at different levels
- [ ] Test with and without background music

### 9.3 Performance & Limits Testing
- [ ] Test with large image files (high resolution)
- [ ] Test memory usage during processing
- [ ] Identify and document memory limits
- [ ] Test on slower machines/browsers
- [ ] Optimize for typical use case (3-5 min audio, 5-10 images)

### 9.4 Error Scenario Testing
- [ ] Test with invalid file types
- [ ] Test with corrupted files
- [ ] Test with extremely large files
- [ ] Test browser tab refresh during processing
- [ ] Test network disconnection (should still work - fully client-side)

---

## Phase 10: Documentation & Polish

- [ ] Write user-facing README with usage instructions
- [ ] Create inline help text/tooltips in UI
- [ ] Add "About" or "How It Works" section
- [ ] Document browser requirements
- [ ] Document file size/count limitations
- [ ] Add loading states for FFMPEG.wasm initialization
- [ ] Polish UI/UX (spacing, colors, responsiveness)
- [ ] Add favicon and meta tags
- [ ] Optimize bundle size

---

## Phase 11: Deployment

- [ ] Configure Vercel project
- [ ] Set up environment variables (if any)
- [ ] Deploy to Vercel
- [ ] Test deployed version
- [ ] Verify client-side only processing (no server uploads)
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

---

## Future Enhancements (Post-MVP)

- [ ] Text overlay support for images
- [ ] Custom timing per image (manual duration control)
- [ ] Additional transition effects
- [ ] Video export quality settings (720p, 1080p, 4K)
- [ ] Progress save/restore functionality
- [ ] Batch processing multiple videos
- [ ] Video preview before download
- [ ] Custom aspect ratio selection
- [ ] Watermark support

---

## Success Criteria (from PRD)

✓ User successfully generates a video on first attempt without errors
✓ Processing time remains reasonable for typical use cases (3-5 minute audio with 5-10 images)
✓ Zero file uploads to servers (100% client-side processing)
✓ Clear user feedback throughout the video generation process
