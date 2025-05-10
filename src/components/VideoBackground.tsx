import React, { useEffect, useRef } from "react";

interface VideoBackgroundProps {
  videoUrl?: string;
  blur?: number;
  brightness?: number;
}

const VideoBackground = ({
  videoUrl = "https://streamable.com/bva5gw",
  blur = 50,
  brightness = 30,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Extract the video ID from the streamable URL
    const videoId = videoUrl.split("/").pop();

    // If we have a video reference and ID, set up the video
    if (videoRef.current && videoId) {
      // For streamable videos, we need to use their embed URL
      videoRef.current.src = `https://streamable.com/e/${videoId}`;

      // Set video properties
      videoRef.current.autoplay = true;
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
    }
  }, [videoUrl]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1] bg-background">
      {/* Animated particles overlay */}
      <div className="absolute inset-0 z-0 opacity-60">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/40 animate-float"
            style={{
              width: `${Math.random() * 15 + 8}px`,
              height: `${Math.random() * 15 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background z-0"></div>

      {/* Video element */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          filter: `blur(${blur / 10}rem) brightness(${brightness}%) saturate(120%)`,
        }}
      >
        <iframe
          ref={videoRef as React.RefObject<HTMLIFrameElement>}
          className="w-full h-full object-cover"
          title="Background Video"
          allow="autoplay"
          frameBorder="0"
        />
      </div>

      {/* Animated glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-radial from-primary/20 to-transparent animate-pulse-slow"></div>
    </div>
  );
};

export default VideoBackground;
