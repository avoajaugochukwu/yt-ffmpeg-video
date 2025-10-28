# YouTube Video Creator

A client-side web application for creating videos from images and audio files. All processing happens in your browser - no server uploads required!

## Features

- **100% Client-Side Processing**: Your files never leave your browser
- **Multiple Transition Effects**: Choose from 4 different transitions (Fade, Fade to Black, Wipe Left, Wipe Up)
- **Background Music Support**: Mix background music with your primary audio
- **Smart Image Sorting**: Automatically sorts images by numerical sequences
- **Drag & Drop Reordering**: Easily reorder your images
- **Auto-Resolution Detection**: Automatically uses the highest resolution from your images
- **Real-Time Progress**: See exactly what's happening during video generation
- **Responsive Design**: Works on desktop and tablet devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## How It Works

1. **Upload Primary Audio**: Add the main audio track for your video (MP3, WAV, AAC, M4A)
2. **Upload Images**: Select multiple images (JPEG, PNG, WebP)
3. **Optional Background Music**: Add background music to be mixed with primary audio
4. **Choose Transition**: Select how images transition during the video
5. **Adjust Volume**: Set background music volume (0-50%)
6. **Generate Video**: Click "Generate Video" and wait for processing
7. **Download**: Download your completed MP4 video!

## Browser Requirements

This application requires a modern browser with support for:
- **WebAssembly**: For FFMPEG.wasm video processing
- **SharedArrayBuffer**: Required by FFMPEG.wasm
- **File API**: For loading local files

### Supported Browsers
- Chrome 92+ (recommended)
- Firefox 95+
- Safari 15.2+
- Edge 92+

## Development

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Video Processing**: FFMPEG.wasm
- **Linting**: ESLint + Prettier

## Project Structure

```
yt-video-creator/
├── app/
│   ├── components/
│   │   ├── file-inputs/       # File upload components
│   │   ├── image-preview/     # Image preview and reordering
│   │   ├── controls/          # Settings and action buttons
│   │   └── progress/          # Progress and error display
│   ├── lib/
│   │   ├── ffmpeg/            # FFMPEG initialization and transitions
│   │   ├── audio/             # Audio duration and timing utilities
│   │   ├── video/             # Video generation pipeline
│   │   └── utils/             # Validation and helper utilities
│   ├── store/                 # Zustand state management
│   ├── types/                 # TypeScript type definitions
│   ├── page.tsx               # Main application page
│   └── globals.css            # Global styles
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── vercel.json                # Vercel deployment config (headers)
└── tailwind.config.js         # Tailwind CSS configuration
```

## File Size Limits

To ensure smooth performance, the following limits are enforced:
- **Audio files**: 100 MB maximum
- **Image files**: 20 MB per image
- **Total images**: No hard limit, but performance may vary

## Known Limitations

1. **Memory Usage**: Processing large files or many images requires significant browser memory
2. **Processing Time**: Video generation time depends on:
   - Number of images
   - Audio duration
   - Image resolution
   - Device performance
3. **Mobile Support**: Limited due to memory constraints on mobile devices
4. **Browser Tab**: Must keep the tab open during processing

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy (vercel.json is already configured with required headers)

### Other Platforms

If deploying to other platforms, ensure you configure the following headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers are required for SharedArrayBuffer support (used by FFMPEG.wasm).

## Troubleshooting

### "Browser not supported" error
- Update your browser to the latest version
- Try a different browser (Chrome recommended)
- Check if SharedArrayBuffer is available in your browser console: `typeof SharedArrayBuffer`

### Video generation fails
- Check file formats (audio: MP3/WAV/AAC, images: JPEG/PNG/WebP)
- Reduce image count or resolution
- Try with smaller file sizes
- Check browser console for detailed error messages

### Slow performance
- Use fewer images
- Reduce image resolution before uploading
- Use shorter audio files
- Close other browser tabs to free memory

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to ensure no errors
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **FFMPEG.wasm**: For making video processing possible in the browser
- **Next.js**: For the excellent React framework
- **Zustand**: For simple and effective state management
- **Tailwind CSS**: For rapid UI development

---

**Note**: This application performs all processing in your browser. Your files are never uploaded to any server, ensuring complete privacy and security.
